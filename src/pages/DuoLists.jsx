import { useState } from 'react'
import { PLAYERS } from '../data/initialData'

function formatDateShort(d) {
  const [y, m, day] = d.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} '${y.slice(2)}`
}

function AddDuoEntry({ playerA, playerB, onAdd, onClose }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ date: today, a: '', b: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const va = parseInt(form.a)
    const vb = parseInt(form.b)
    if (!form.date) return setError('Datum fehlt.')
    if (isNaN(va) || isNaN(vb) || va < 0 || vb < 0) return setError('Werte müssen ≥ 0 sein.')
    const entry = { date: form.date }
    entry[playerA.id] = va
    entry[playerB.id] = vb
    onAdd(entry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(12,10,8,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="card w-full max-w-sm animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg tracking-wider">
            <span style={{ color: playerA.color }}>{playerA.short}</span>
            <span className="text-stone-600 mx-2">vs</span>
            <span style={{ color: playerB.color }}>{playerB.short}</span>
          </h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-title block">Datum</label>
            <input type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="input-field" style={{ colorScheme: 'dark' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display tracking-wider mb-2" style={{ color: playerA.color }}>
                {playerA.short}
              </label>
              <input type="number" min="0" max="20" placeholder="0" value={form.a}
                onChange={e => setForm(f => ({ ...f, a: e.target.value }))}
                className="input-field text-center text-2xl font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-display tracking-wider mb-2" style={{ color: playerB.color }}>
                {playerB.short}
              </label>
              <input type="number" min="0" max="20" placeholder="0" value={form.b}
                onChange={e => setForm(f => ({ ...f, b: e.target.value }))}
                className="input-field text-center text-2xl font-mono font-bold" />
            </div>
          </div>

          {error && <p className="text-dante text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Abbrechen</button>
            <button type="submit" className="btn-primary flex-1">Eintragen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DuoCard({ playerA, playerB, entries, totals, onAdd, onDelete, colorClass }) {
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const aWins = totals[playerA.id] || 0
  const bWins = totals[playerB.id] || 0
  const total = aWins + bWins
  const leader = aWins > bWins ? playerA : aWins < bWins ? playerB : null

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      {showModal && (
        <AddDuoEntry playerA={playerA} playerB={playerB} onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}

      <div className={`card ${colorClass} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-5"
          style={{ background: `linear-gradient(135deg, ${playerA.color} 0%, ${playerB.color} 100%)` }} />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="section-title">Duo</p>
                <h2 className="font-display font-bold text-xl tracking-wider">
                  <span style={{ color: playerA.color }}>{playerA.short}</span>
                  <span className="text-stone-600 mx-2">vs</span>
                  <span style={{ color: playerB.color }}>{playerB.short}</span>
                </h2>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary text-xs px-4 py-2">
              + Eintrag
            </button>
          </div>

          {/* Score display */}
          <div className="flex items-center gap-0 mb-6">
            <div className="flex-1 text-center">
              <div className="stat-number" style={{ color: playerA.color }}>{aWins}</div>
              <div className="font-display text-xs tracking-widest mt-1" style={{ color: `${playerA.color}80` }}>
                {playerA.name}
              </div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="font-display text-stone-600 text-sm tracking-widest">VS</div>
              {leader && (
                <div className="mt-1 text-[10px] font-mono text-stone-500">
                  +{Math.abs(aWins - bWins)}
                </div>
              )}
            </div>
            <div className="flex-1 text-center">
              <div className="stat-number" style={{ color: playerB.color }}>{bWins}</div>
              <div className="font-display text-xs tracking-widest mt-1" style={{ color: `${playerB.color}80` }}>
                {playerB.name}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden flex bg-stone-800 mb-2">
            <div className="h-full transition-all duration-700 rounded-full"
              style={{ width: `${total ? (aWins / total) * 100 : 50}%`, background: playerA.color }} />
            <div className="h-full transition-all duration-700 rounded-full"
              style={{ width: `${total ? (bWins / total) * 100 : 50}%`, background: playerB.color }} />
          </div>

          {leader && (
            <p className="text-xs font-body text-stone-500 text-center mb-4">
              <span style={{ color: leader.color }}>{leader.short}</span> führt mit {Math.abs(aWins - bWins)} Siegen
            </p>
          )}
          {!leader && total > 0 && (
            <p className="text-xs font-body text-stone-500 text-center mb-4">Gleichstand</p>
          )}

          <div className="divider" />

          {/* Entry list */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {sorted.length === 0 && (
              <p className="text-stone-600 font-body text-center py-6">Noch keine Einträge</p>
            )}
            {sorted.map(entry => {
              const aVal = entry[playerA.id]
              const bVal = entry[playerB.id]
              const entryLeader = aVal > bVal ? playerA : aVal < bVal ? playerB : null
              return (
                <div key={entry.id}
                  className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-stone-800/50 transition-colors border border-transparent hover:border-stone-700/30">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-stone-500 text-xs w-24">{formatDateShort(entry.date)}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold" style={{ color: aVal >= bVal ? playerA.color : `${playerA.color}50` }}>{aVal}</span>
                      <span className="text-stone-700 text-xs">:</span>
                      <span className="font-mono font-bold" style={{ color: bVal >= aVal ? playerB.color : `${playerB.color}50` }}>{bVal}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entryLeader && (
                      <span className="text-[10px] font-display tracking-wider opacity-50" style={{ color: entryLeader.color }}>
                        {entryLeader.short}
                      </span>
                    )}
                    {deleteId === entry.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => { onDelete(entry.id); setDeleteId(null) }}
                          className="text-[10px] text-dante px-1.5 py-0.5 border border-dante/40 rounded font-display">
                          Löschen
                        </button>
                        <button onClick={() => setDeleteId(null)}
                          className="text-[10px] text-stone-500 px-1.5 py-0.5 border border-stone-600 rounded font-display">
                          Nein
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-dante text-xs font-mono transition-all">
                        ×
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default function DuoLists({ duoCarl, duoDante, duoCarlTotals, duoDanteTotals, addDuoCarlEntry, addDuoDanteEntry, deleteDuoCarlEntry, deleteDuoDanteEntry }) {
  const dominic = PLAYERS.dominic
  const carl = PLAYERS.carl
  const dante = PLAYERS.dante

  return (
    <div className="space-y-6">
      <div className="animate-in">
        <p className="section-title">Unabhängige Duelle</p>
        <h1 className="page-title">Duo-Listen</h1>
        <p className="text-stone-400 font-body mt-1">Getrennt vom 1v1v1 — reine Kopf-an-Kopf-Daten</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-in stagger-2">
          <DuoCard
            playerA={dominic}
            playerB={carl}
            entries={duoCarl}
            totals={duoCarlTotals}
            onAdd={addDuoCarlEntry}
            onDelete={deleteDuoCarlEntry}
            colorClass="card-glow-carl"
          />
        </div>

        <div className="animate-in stagger-3">
          <DuoCard
            playerA={dominic}
            playerB={dante}
            entries={duoDante}
            totals={duoDanteTotals}
            onAdd={addDuoDanteEntry}
            onDelete={deleteDuoDanteEntry}
            colorClass="card-glow-dante"
          />
        </div>
      </div>

      {/* Combined summary */}
      <div className="card animate-in stagger-4">
        <p className="section-title">Dominic's Duo-Bilanz</p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-sm tracking-wider" style={{ color: carl.color }}>vs Carl</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-mono font-bold text-dominic">{duoCarlTotals.dominic}</div>
              <div className="text-stone-600">:</div>
              <div className="text-2xl font-mono font-bold" style={{ color: carl.color }}>{duoCarlTotals.carl}</div>
            </div>
            <div className="text-stone-500 text-xs font-body mt-1">
              {duoCarlTotals.dominic + duoCarlTotals.carl} Spiele · {
                duoCarlTotals.dominic + duoCarlTotals.carl > 0
                  ? `${((duoCarlTotals.dominic / (duoCarlTotals.dominic + duoCarlTotals.carl)) * 100).toFixed(0)}% Dome`
                  : '–'
              }
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-sm tracking-wider" style={{ color: dante.color }}>vs Dante</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-mono font-bold text-dominic">{duoDanteTotals.dominic}</div>
              <div className="text-stone-600">:</div>
              <div className="text-2xl font-mono font-bold" style={{ color: dante.color }}>{duoDanteTotals.dante}</div>
            </div>
            <div className="text-stone-500 text-xs font-body mt-1">
              {duoDanteTotals.dominic + duoDanteTotals.dante} Spiele · {
                duoDanteTotals.dominic + duoDanteTotals.dante > 0
                  ? `${((duoDanteTotals.dominic / (duoDanteTotals.dominic + duoDanteTotals.dante)) * 100).toFixed(0)}% Dome`
                  : '–'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
