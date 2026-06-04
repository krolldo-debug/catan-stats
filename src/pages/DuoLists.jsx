import { useState } from 'react'
import { PLAYERS } from '../data/initialData'

function formatDateShort(d) {
  const [y, m, day] = d.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m)]} '${y.slice(2)}`
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
    const entry = { date: form.date, [playerA.id]: va, [playerB.id]: vb }
    onAdd(entry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(12,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card w-full sm:max-w-sm rounded-b-none sm:rounded-xl"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg tracking-wider">
            <span style={{ color: playerA.color }}>{playerA.short}</span>
            <span className="text-stone-600 mx-2">vs</span>
            <span style={{ color: playerB.color }}>{playerB.short}</span>
          </h2>
          <button onClick={onClose} className="text-stone-500 text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-title block">Datum</label>
            <input type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="input-field" style={{ colorScheme: 'dark' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[{ p: playerA, key: 'a' }, { p: playerB, key: 'b' }].map(({ p, key }) => (
              <div key={p.id}>
                <div className="text-center text-xs font-display tracking-wider mb-2" style={{ color: p.color }}>{p.short}</div>
                <input type="number" min="0" max="20" placeholder="0" inputMode="numeric"
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="input-field text-center text-2xl font-mono font-bold py-3" />
              </div>
            ))}
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

function DuoCard({ playerA, playerB, entries, totals, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const aWins = totals[playerA.id] || 0
  const bWins = totals[playerB.id] || 0
  const total = aWins + bWins
  const leader = aWins > bWins ? playerA : aWins < bWins ? playerB : null

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      {showModal && <AddDuoEntry playerA={playerA} playerB={playerB} onAdd={onAdd} onClose={() => setShowModal(false)} />}

      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${playerA.color} 0%, ${playerB.color} 100%)` }} />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-title">Duo</p>
              <h2 className="font-display font-bold text-xl tracking-wider">
                <span style={{ color: playerA.color }}>{playerA.short}</span>
                <span className="text-stone-600 mx-2">vs</span>
                <span style={{ color: playerB.color }}>{playerB.short}</span>
              </h2>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary text-xs px-4 py-2">+ Neu</button>
          </div>

          {/* Score */}
          <div className="flex items-center mb-4">
            <div className="flex-1 text-center">
              <div className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: playerA.color }}>{aWins}</div>
              <div className="font-display text-[10px] tracking-widest mt-1" style={{ color: `${playerA.color}70` }}>{playerA.name}</div>
            </div>
            <div className="text-stone-600 font-display text-sm px-2">VS</div>
            <div className="flex-1 text-center">
              <div className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: playerB.color }}>{bWins}</div>
              <div className="font-display text-[10px] tracking-widest mt-1" style={{ color: `${playerB.color}70` }}>{playerB.name}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden flex bg-stone-800 mb-2">
            <div className="h-full" style={{ width: `${total ? (aWins / total) * 100 : 50}%`, background: playerA.color }} />
            <div className="h-full" style={{ width: `${total ? (bWins / total) * 100 : 50}%`, background: playerB.color }} />
          </div>
          <p className="text-xs font-body text-stone-500 text-center mb-4">
            {leader ? (
              <><span style={{ color: leader.color }}>{leader.short}</span> führt mit {Math.abs(aWins - bWins)} Siegen</>
            ) : total > 0 ? 'Gleichstand' : 'Noch keine Spiele'}
          </p>

          <div className="divider" />

          {/* Entry list */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {sorted.length === 0 && (
              <p className="text-stone-600 font-body text-center py-6 text-sm">Noch keine Einträge</p>
            )}
            {sorted.map(entry => {
              const aVal = entry[playerA.id]
              const bVal = entry[playerB.id]
              const winner = aVal > bVal ? playerA : aVal < bVal ? playerB : null
              return (
                <div key={entry.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-stone-500 text-xs">{formatDateShort(entry.date)}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base"
                        style={{ color: aVal >= bVal ? playerA.color : `${playerA.color}40` }}>{aVal}</span>
                      <span className="text-stone-700 text-xs">:</span>
                      <span className="font-mono font-bold text-base"
                        style={{ color: bVal >= aVal ? playerB.color : `${playerB.color}40` }}>{bVal}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {winner && <span className="text-[10px] font-display tracking-wide" style={{ color: winner.color }}>{winner.short}</span>}
                    {deleteId === entry.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => { onDelete(entry.id); setDeleteId(null) }}
                          className="text-[10px] text-dante px-1.5 py-0.5 border border-dante/40 rounded">Ja</button>
                        <button onClick={() => setDeleteId(null)}
                          className="text-[10px] text-stone-400 px-1.5 py-0.5 border border-stone-600 rounded">Nein</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(entry.id)}
                        className="text-stone-700 hover:text-dante text-lg font-mono w-5 flex items-center justify-center transition-colors">×</button>
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

export default function DuoLists({
  duoCarl, duoDante, duoDanteCarl,
  duoCarlTotals, duoDanteTotals, duoDanteCarlTotals,
  addDuoCarlEntry, addDuoDanteEntry, addDuoDanteCarlEntry,
  deleteDuoCarlEntry, deleteDuoDanteEntry, deleteDuoDanteCarlEntry,
}) {
  const { dominic, carl, dante } = PLAYERS

  return (
    <div className="space-y-4">
      <div>
        <p className="section-title">Kopf an Kopf</p>
        <h1 className="page-title">Duo-Listen</h1>
        <p className="text-stone-400 font-body mt-1 text-sm">Unabhängig vom 1v1v1</p>
      </div>

      <DuoCard playerA={dominic} playerB={carl}
        entries={duoCarl} totals={duoCarlTotals}
        onAdd={addDuoCarlEntry} onDelete={deleteDuoCarlEntry} />

      <DuoCard playerA={dominic} playerB={dante}
        entries={duoDante} totals={duoDanteTotals}
        onAdd={addDuoDanteEntry} onDelete={deleteDuoDanteEntry} />

      <DuoCard playerA={dante} playerB={carl}
        entries={duoDanteCarl} totals={duoDanteCarlTotals}
        onAdd={addDuoDanteCarlEntry} onDelete={deleteDuoDanteCarlEntry} />

      {/* Summary — all three head-to-heads */}
      <div className="card">
        <p className="section-title">Alle Duelle</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { a: dominic, b: carl, t: duoCarlTotals },
            { a: dominic, b: dante, t: duoDanteTotals },
            { a: dante, b: carl, t: duoDanteCarlTotals },
          ].map(({ a, b, t }) => {
            const av = t[a.id] || 0
            const bv = t[b.id] || 0
            const total = av + bv
            const leader = av > bv ? a : av < bv ? b : null
            return (
              <div key={a.id + b.id} className="rounded-lg bg-stone-800/40 border border-stone-700/30 p-3">
                <div className="text-xs font-display tracking-wider mb-2">
                  <span style={{ color: a.color }}>{a.short}</span>
                  <span className="text-stone-600"> vs </span>
                  <span style={{ color: b.color }}>{b.short}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-2xl" style={{ color: a.color }}>{av}</span>
                  <span className="text-stone-700">:</span>
                  <span className="font-mono font-bold text-2xl" style={{ color: b.color }}>{bv}</span>
                </div>
                <div className="text-stone-600 text-[10px] font-body mt-1">
                  {total > 0
                    ? `${total} Spiele · ${leader ? leader.short + ' führt' : 'Gleichstand'}`
                    : 'Noch keine Spiele'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
