import { useState } from 'react'
import { PLAYERS } from '../data/initialData'

const PLAYER_LIST = Object.values(PLAYERS)

function formatDate(d) {
  const [y, m, day] = d.split('-')
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} ${y}`
}

function formatDateShort(d) {
  const [y, m, day] = d.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} '${y.slice(2)}`
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
    if (isNaN(d) || isNaN(da) || isNaN(c) || d < 0 || da < 0 || c < 0) return setError('Alle Spielerzahlen müssen ≥ 0 sein.')
    onAdd({ date: form.date, dominic: d, dante: da, carl: c })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(12,10,8,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="card w-full max-w-md animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl tracking-wider text-stone-100">Spielabend eintragen</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-title block">Datum</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {PLAYER_LIST.map(p => (
              <div key={p.id}>
                <label className="block text-xs font-display tracking-wider mb-2" style={{ color: p.color }}>
                  {p.short}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  placeholder="0"
                  value={form[p.id]}
                  onChange={e => setForm(f => ({ ...f, [p.id]: e.target.value }))}
                  className="input-field text-center text-xl font-mono font-bold"
                  style={{ borderColor: form[p.id] !== '' ? `${p.color}60` : undefined }}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-dante text-sm font-body">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Abbrechen</button>
            <button type="submit" className="btn-primary flex-1">Eintragen</button>
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
    const winners = ['dominic', 'dante', 'carl'].filter(p => gn[p] === max)
    if (winners.length > 1) return null
    return winners[0]
  }

  return (
    <div className="space-y-6">
      {showModal && <AddGameNightModal onAdd={addGameNight} onClose={() => setShowModal(false)} />}

      <div className="flex items-end justify-between animate-in">
        <div>
          <p className="section-title">Spielverlauf</p>
          <h1 className="page-title">Spielabend-Historie</h1>
          <p className="text-stone-400 font-body mt-1">{gameNights.length} Abende · {totals.games} Spiele gesamt</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Eintragen
        </button>
      </div>

      {/* Total bar */}
      <div className="card animate-in stagger-2">
        <p className="section-title">Gesamtsiege</p>
        <div className="flex items-center gap-6">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="font-display text-xs tracking-wider" style={{ color: p.color }}>{p.short}</span>
              <span className="font-mono font-bold text-lg text-stone-200">{totals[p.id]}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden flex bg-stone-800">
          {PLAYER_LIST.map(p => (
            <div
              key={p.id}
              className="h-full transition-all duration-700"
              style={{ width: `${totals.games ? (totals[p.id] / totals.games) * 100 : 33}%`, background: p.color }}
            />
          ))}
        </div>
      </div>

      {/* Game nights list */}
      <div className="space-y-2 animate-in stagger-3">
        {sorted.map((gn, idx) => {
          const winner = getWinner(gn)
          const total = gn.dominic + gn.dante + gn.carl
          return (
            <div key={gn.id}
              className="group flex items-center justify-between py-3.5 px-5 rounded-xl border transition-all duration-200 hover:border-stone-600/60"
              style={{
                background: 'linear-gradient(90deg, rgba(41,35,25,0.6) 0%, rgba(26,22,18,0.8) 100%)',
                borderColor: winner ? `${PLAYERS[winner].color}25` : 'rgba(61,50,40,0.5)',
              }}>
              <div className="flex items-center gap-5">
                <div className="text-right min-w-[6rem]">
                  <div className="font-mono text-stone-400 text-xs">{formatDateShort(gn.date)}</div>
                  <div className="font-mono text-stone-600 text-[10px]">#{gameNights.length - idx}</div>
                </div>

                <div className="w-px h-8 bg-stone-700/50" />

                <div className="flex items-center gap-5">
                  {PLAYER_LIST.map(p => (
                    <div key={p.id} className="flex flex-col items-center">
                      <div className="text-[10px] font-display tracking-wider mb-1" style={{ color: `${p.color}99` }}>
                        {p.short}
                      </div>
                      <div className={`font-mono font-bold text-lg leading-none ${gn[p.id] === Math.max(gn.dominic, gn.dante, gn.carl) && gn[p.id] > 0 ? '' : 'text-stone-500'}`}
                        style={{ color: gn[p.id] === Math.max(gn.dominic, gn.dante, gn.carl) && gn[p.id] > 0 ? p.color : undefined }}>
                        {gn[p.id]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-px h-8 bg-stone-700/50" />

                <div className="font-mono text-stone-600 text-xs">{total} Spiele</div>
              </div>

              <div className="flex items-center gap-3">
                {winner && (
                  <div className="text-xs font-display tracking-wider opacity-60" style={{ color: PLAYERS[winner].color }}>
                    {PLAYERS[winner].short} siegt
                  </div>
                )}
                {deleteId === gn.id ? (
                  <div className="flex items-center gap-2 opacity-100">
                    <button onClick={() => { deleteGameNight(gn.id); setDeleteId(null) }}
                      className="text-xs text-dante hover:text-dante-light font-display tracking-wider px-2 py-1 border border-dante/40 rounded transition-colors">
                      Löschen
                    </button>
                    <button onClick={() => setDeleteId(null)}
                      className="text-xs text-stone-500 hover:text-stone-300 font-display tracking-wider px-2 py-1 border border-stone-600 rounded transition-colors">
                      Abbruch
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteId(gn.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-dante text-xs font-mono transition-all duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
