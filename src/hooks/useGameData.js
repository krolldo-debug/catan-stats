import { useState, useEffect, useCallback } from 'react'
import {
  INITIAL_GAME_NIGHTS,
  INITIAL_DUO_DOMINIC_CARL,
  INITIAL_DUO_DOMINIC_DANTE,
} from '../data/initialData'

const CACHE_KEY = 'catan_cache_v3'

// Read a local snapshot: new cache key first, then legacy localStorage keys
// (so data entered before the cloud switch is preserved and can seed the cloud).
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  try {
    const gn = localStorage.getItem('catan_game_nights')
    if (gn) {
      return {
        gameNights: JSON.parse(gn),
        duoCarl: JSON.parse(localStorage.getItem('catan_duo_carl') || '[]'),
        duoDante: JSON.parse(localStorage.getItem('catan_duo_dante') || '[]'),
      }
    }
  } catch { /* ignore */ }
  return null
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

export function useGameData() {
  const [gameNights, setGameNights] = useState([])
  const [duoCarl, setDuoCarl] = useState([])
  const [duoDante, setDuoDante] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [offline, setOffline] = useState(false)

  // Save the complete state to the cloud + local cache
  const persist = useCallback(async (next) => {
    writeCache(next)
    setSyncing(true)
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error('save failed')
      setOffline(false)
    } catch {
      setOffline(true)
    } finally {
      setSyncing(false)
    }
  }, [])

  // Pull the latest from the central DB and apply it (cloud is source of truth)
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/data')
      if (!res.ok) return false
      const data = await res.json()
      if (data && Array.isArray(data.gameNights)) {
        setGameNights(data.gameNights)
        setDuoCarl(data.duoCarl || [])
        setDuoDante(data.duoDante || [])
        writeCache(data)
        setOffline(false)
        return true
      }
      return null // cloud reachable but empty
    } catch {
      setOffline(true)
      return false
    }
  }, [])

  // Initial load: show cache instantly, then pull cloud as source of truth
  useEffect(() => {
    let cancelled = false
    const cache = readCache()
    if (cache) {
      setGameNights(cache.gameNights || [])
      setDuoCarl(cache.duoCarl || [])
      setDuoDante(cache.duoDante || [])
    }

    ;(async () => {
      const result = await refresh()
      if (cancelled) return

      if (result === null) {
        // Cloud reachable but empty → seed once from this device (or sample)
        const seed = cache || {
          gameNights: INITIAL_GAME_NIGHTS,
          duoCarl: INITIAL_DUO_DOMINIC_CARL,
          duoDante: INITIAL_DUO_DOMINIC_DANTE,
        }
        setGameNights(seed.gameNights)
        setDuoCarl(seed.duoCarl)
        setDuoDante(seed.duoDante)
        await persist(seed)
      } else if (result === false && !cache) {
        // No API (e.g. local dev) and nothing cached → show sample data
        setGameNights(INITIAL_GAME_NIGHTS)
        setDuoCarl(INITIAL_DUO_DOMINIC_CARL)
        setDuoDante(INITIAL_DUO_DOMINIC_DANTE)
      }
      if (!cancelled) setLoading(false)
    })()

    return () => { cancelled = true }
  }, [persist, refresh])

  // Live sync: re-pull whenever the user returns to the app (focus / tab visible)
  useEffect(() => {
    const onActive = () => {
      if (document.visibilityState !== 'hidden') refresh()
    }
    window.addEventListener('focus', onActive)
    document.addEventListener('visibilitychange', onActive)
    return () => {
      window.removeEventListener('focus', onActive)
      document.removeEventListener('visibilitychange', onActive)
    }
  }, [refresh])

  // --- Mutations (each computes the full next state and persists it) ---
  const addGameNight = (entry) => {
    const next = [...gameNights, { ...entry, id: `gn${Date.now()}` }]
      .sort((a, b) => a.date.localeCompare(b.date))
    setGameNights(next)
    persist({ gameNights: next, duoCarl, duoDante })
  }

  const deleteGameNight = (id) => {
    const next = gameNights.filter(g => g.id !== id)
    setGameNights(next)
    persist({ gameNights: next, duoCarl, duoDante })
  }

  const addDuoCarlEntry = (entry) => {
    const next = [...duoCarl, { ...entry, id: `dc${Date.now()}` }]
      .sort((a, b) => a.date.localeCompare(b.date))
    setDuoCarl(next)
    persist({ gameNights, duoCarl: next, duoDante })
  }

  const deleteDuoCarlEntry = (id) => {
    const next = duoCarl.filter(e => e.id !== id)
    setDuoCarl(next)
    persist({ gameNights, duoCarl: next, duoDante })
  }

  const addDuoDanteEntry = (entry) => {
    const next = [...duoDante, { ...entry, id: `dd${Date.now()}` }]
      .sort((a, b) => a.date.localeCompare(b.date))
    setDuoDante(next)
    persist({ gameNights, duoCarl, duoDante: next })
  }

  const deleteDuoDanteEntry = (id) => {
    const next = duoDante.filter(e => e.id !== id)
    setDuoDante(next)
    persist({ gameNights, duoCarl, duoDante: next })
  }

  // --- Derived data ---
  const totals = gameNights.reduce(
    (acc, gn) => ({
      dominic: acc.dominic + gn.dominic,
      dante: acc.dante + gn.dante,
      carl: acc.carl + gn.carl,
      games: acc.games + gn.dominic + gn.dante + gn.carl,
    }),
    { dominic: 0, dante: 0, carl: 0, games: 0 }
  )

  const cumulativeData = gameNights.reduce((acc, gn) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : { dominic: 0, dante: 0, carl: 0 }
    acc.push({
      date: gn.date,
      dominic: prev.dominic + gn.dominic,
      dante: prev.dante + gn.dante,
      carl: prev.carl + gn.carl,
    })
    return acc
  }, [])

  const monthlyMap = {}
  gameNights.forEach(gn => {
    const month = gn.date.slice(0, 7)
    if (!monthlyMap[month]) monthlyMap[month] = { month, dominic: 0, dante: 0, carl: 0 }
    monthlyMap[month].dominic += gn.dominic
    monthlyMap[month].dante += gn.dante
    monthlyMap[month].carl += gn.carl
  })
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month))

  const getStreak = (player) => {
    const sorted = [...gameNights].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    for (const gn of sorted) {
      if (gn[player] > 0) streak++
      else break
    }
    return streak
  }

  const last10 = gameNights.slice(-10)

  const duoCarlTotals = duoCarl.reduce(
    (acc, e) => ({ dominic: acc.dominic + e.dominic, carl: acc.carl + e.carl }),
    { dominic: 0, carl: 0 }
  )
  const duoDanteTotals = duoDante.reduce(
    (acc, e) => ({ dominic: acc.dominic + e.dominic, dante: acc.dante + e.dante }),
    { dominic: 0, dante: 0 }
  )

  return {
    gameNights, duoCarl, duoDante,
    totals, cumulativeData, monthlyData, last10,
    duoCarlTotals, duoDanteTotals,
    addGameNight, deleteGameNight,
    addDuoCarlEntry, addDuoDanteEntry,
    deleteDuoCarlEntry, deleteDuoDanteEntry,
    getStreak,
    loading, syncing, offline,
    refresh,
  }
}
