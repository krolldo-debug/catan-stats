import { useState, useEffect } from 'react'
import {
  INITIAL_GAME_NIGHTS,
  INITIAL_DUO_DOMINIC_CARL,
  INITIAL_DUO_DOMINIC_DANTE,
} from '../data/initialData'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export function useGameData() {
  const [gameNights, setGameNights] = useLocalStorage('catan_game_nights', INITIAL_GAME_NIGHTS)
  const [duoCarl, setDuoCarl] = useLocalStorage('catan_duo_carl', INITIAL_DUO_DOMINIC_CARL)
  const [duoDante, setDuoDante] = useLocalStorage('catan_duo_dante', INITIAL_DUO_DOMINIC_DANTE)

  const addGameNight = (entry) => {
    const newEntry = {
      ...entry,
      id: `gn${Date.now()}`,
    }
    setGameNights(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
  }

  const deleteGameNight = (id) => {
    setGameNights(prev => prev.filter(gn => gn.id !== id))
  }

  const addDuoCarlEntry = (entry) => {
    const newEntry = { ...entry, id: `dc${Date.now()}` }
    setDuoCarl(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
  }

  const addDuoDanteEntry = (entry) => {
    const newEntry = { ...entry, id: `dd${Date.now()}` }
    setDuoDante(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
  }

  const deleteDuoCarlEntry = (id) => setDuoCarl(prev => prev.filter(e => e.id !== id))
  const deleteDuoDanteEntry = (id) => setDuoDante(prev => prev.filter(e => e.id !== id))

  // Aggregate totals
  const totals = gameNights.reduce(
    (acc, gn) => ({
      dominic: acc.dominic + gn.dominic,
      dante: acc.dante + gn.dante,
      carl: acc.carl + gn.carl,
      games: acc.games + gn.dominic + gn.dante + gn.carl,
    }),
    { dominic: 0, dante: 0, carl: 0, games: 0 }
  )

  // Cumulative wins over time for line chart
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

  // Monthly aggregation
  const monthlyMap = {}
  gameNights.forEach(gn => {
    const month = gn.date.slice(0, 7)
    if (!monthlyMap[month]) monthlyMap[month] = { month, dominic: 0, dante: 0, carl: 0 }
    monthlyMap[month].dominic += gn.dominic
    monthlyMap[month].dante += gn.dante
    monthlyMap[month].carl += gn.carl
  })
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month))

  // Current streak (consecutive game nights with at least 1 win)
  const getStreak = (player) => {
    const sorted = [...gameNights].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    for (const gn of sorted) {
      if (gn[player] > 0) streak++
      else break
    }
    return streak
  }

  // Last 10 nights form
  const last10 = gameNights.slice(-10)

  // Duo totals
  const duoCarlTotals = duoCarl.reduce(
    (acc, e) => ({ dominic: acc.dominic + e.dominic, carl: acc.carl + e.carl }),
    { dominic: 0, carl: 0 }
  )
  const duoDanteTotals = duoDante.reduce(
    (acc, e) => ({ dominic: acc.dominic + e.dominic, dante: acc.dante + e.dante }),
    { dominic: 0, dante: 0 }
  )

  return {
    gameNights,
    duoCarl,
    duoDante,
    totals,
    cumulativeData,
    monthlyData,
    last10,
    duoCarlTotals,
    duoDanteTotals,
    addGameNight,
    deleteGameNight,
    addDuoCarlEntry,
    addDuoDanteEntry,
    deleteDuoCarlEntry,
    deleteDuoDanteEntry,
    getStreak,
  }
}
