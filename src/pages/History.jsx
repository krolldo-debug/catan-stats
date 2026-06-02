import { useState } from 'react'
import { PLAYERS } from '../data/initialData'

const PLAYER_LIST = Object.values(PLAYERS)

function formatDateFull(d) {
  const [y, m, day] = d.split('-')
  const months = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return `${parseInt(day)}. ${months[parseInt(m)]} ${y}`
}

function formatDateShort(d) {
  const [y, m, day] = d.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m)]} '${y.slice(2)}`
}

function AddGameNightModal({ onAdd, onClose }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ date: today, dominic: '', dante: '', carl: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const d = parseInt(form.dominic)
    const da = parseInt(form.dante)
    const c = parseInt(form.carl)
    if (!form.date) return setError('Datum fehlt.')
    if (isNaN(d) || isNaN(da) || isNaN(c) || d < 0 || da < 0 || c < 0)
      return setError('Alle Werte müssen ≥ 0 sein.')
    onAdd({ date: form.date, dominic: d, dante: da, carl: c })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(12,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card w-full sm:max-w-md rounded-b-none sm:rounded-xl"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg tracking-wider">Spielabend eintragen</h2>
          <button onClick={onClose} className="text-stone-500 text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-title block">Datum</label>
            <input type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="input-field text-base" style={{ colorScheme: 'dark' }} />
          </div>

          <div>
            <label className="section-title block">Siege pro Spieler</label>
            <div className="grid grid-cols-3 gap-3">
              {PLAYER_LIST.map(p => (
                <div key={p.id}>
                  <div className="text-center text-xs font-display tracking-wider mb-2" style={{ color: p.color }}>
                    {p.short}
                  </div>
                  <input type="number" min="0" max="20" placeholder="0"
                    inputMode="numeric"
                    value={form[p.id]}
                    onChange={e => setForm(f => ({ ...f, [p.id]: e.target.value }))}
                    className="input-field text-center text-2xl font-mono font-bold py-3"
                    style={{ borderColor: form[p.id] !== '' ? `${p.color}60` : undefined }} />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-dante text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-3">Abbrechen</button>
            <button type="submit" className="btn-primary flex-1 py-3">Eintragen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function History({ gameNights, addGameNight, deleteGameNight, totals }) {
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const sorted = [...gameNights].sort((a, b) => b.date.localeCompare(a.date))

  const getWinner = (gn) => {
    const max = Math.max(gn.dominic, gn.dante, gn.carl)
    if (max === 0) return null
    const winners = PLAYER_LIST.filter(p => gn[p.id] === max)
    return winners.length === 1 ? winners[0] : null
  }

  return (
    <div className="space-y-4">
      {showModal && <AddGameNightModal onAdd={addGameNight} onClose={() => setShowModal(false)} />}

      <div className="flex items-end justify-between">
        <div>
          <p className="section-title">Spielverlauf</p>
          <h1 className="page-title">Historie</h1>
          <p className="text-stone-400 font-body mt-1 text-sm">{gameNights.length} Abende · {totals.games} Spiele</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Neu</button>
      </div>

      {/* Totals bar */}
      <div className="card">
        <div className="flex items-center gap-4 mb-3">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="font-display text-[10px] tracking-wider" style={{ color: p.color }}>{p.short}</span>
              <span className="font-mono font-bold text-stone-200">{totals[p.id]}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden flex bg-stone-800">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="h-full"
              style={{ width: `${totals.games ? (totals[p.id] / totals.games) * 100 : 33}%`, background: p.color }} />
          ))}
        </div>
      </div>

      {/* Game nights list */}
      <div className="space-y-2">
        {sorted.map((gn, idx) => {
          const winner = getWinner(gn)
          const total = gn.dominic + gn.dante + gn.carl
          const isDeleting = deleteId === gn.id

          return (
            <div key={gn.id}
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                background: 'linear-gradient(90deg, rgba(41,35,25,0.7) 0%, rgba(26,22,18,0.9) 100%)',
                borderColor: winner ? `${winner.color}30` : 'rgba(61,50,40,0.5)',
              }}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Night number */}
                  <span className="font-mono text-stone-700 text-[10px]">#{gameNights.length - idx}</span>

                  {/* Scores */}
                  <div className="flex items-center gap-2.5">
                    {PLAYER_LIST.map(p => {
                      const isTop = gn[p.id] === Math.max(gn.dominic, gn.dante, gn.carl) && gn[p.id] > 0
                      return (
                        <div key={p.id} className="flex flex-col items-center">
                          <span className="text-[9px] font-display tracking-wide" style={{ color: `${p.color}70` }}>{p.short}</span>
                          <span className="font-mono font-bold text-base leading-tight"
                            style={{ color: isTop ? p.color : '#524537' }}>
                            {gn[p.id]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-stone-400 text-xs">{formatDateShort(gn.date)}</div>
                    <div className="font-mono text-stone-600 text-[10px]">{total} Spiele</div>
                  </div>

                  {isDeleting ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => { deleteGameNight(gn.id); setDeleteId(null) }}
                        className="text-[10px] text-dante px-2 py-1 border border-dante/40 rounded font-display">
                        Löschen
                      </button>
                      <button onClick={() => setDeleteId(null)}
                        className="text-[10px] text-stone-400 px-2 py-1 border border-stone-600 rounded font-display">
                        Nein
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(gn.id)}
                      className="text-stone-700 hover:text-dante text-lg font-mono w-6 h-6 flex items-center justify-center transition-colors">
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
