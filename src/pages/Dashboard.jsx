import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, CartesianGrid
} from 'recharts'
import { PLAYERS } from '../data/initialData'
import PlayerAvatar from '../components/PlayerAvatar'

const PLAYER_LIST = Object.values(PLAYERS)

function StatCard({ player, wins, total, streak, isLeader }) {
  const rate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0'
  return (
    <div className="card relative overflow-hidden"
      style={{ borderColor: isLeader ? `${player.color}66` : `${player.color}30` }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${player.color} 0%, transparent 65%)` }} />
      <div className="relative flex items-center gap-4">
        <PlayerAvatar player={player} size={58} crown={isLeader} />
        <div className="flex-1 min-w-0">
          <div className="font-display text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: player.color }}>
            {player.name}
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display font-bold leading-none" style={{ fontSize: '2.3rem', color: player.color }}>
              {wins}
            </span>
            <span className="text-stone-500 text-xs mb-1">Siege</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-xl font-bold text-stone-200">{rate}%</div>
          <div className="text-stone-500 text-[10px]">Siegrate</div>
          <div className="text-[11px] mt-1.5 font-body" style={{ color: `${player.color}99` }}>
            Serie <span className="font-bold" style={{ color: player.color }}>{streak}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-sm">
      <div className="font-display text-[10px] text-stone-400 mb-2 tracking-wider">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-body text-stone-300">
            {PLAYERS[p.dataKey]?.short}: <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function formatMonthShort(d) {
  const [, m] = d.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return months[parseInt(m)]
}

function formatMonth(m) {
  const [y, mo] = m.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${months[parseInt(mo)]} '${y.slice(2)}`
}

function formatDateShort(d) {
  const [y, m, day] = d.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m)]}`
}

export default function Dashboard({ totals, cumulativeData, monthlyData, gameNights, getStreak }) {
  const recentNights = [...gameNights].reverse().slice(0, 5)
  const maxWins = Math.max(totals.dominic, totals.dante, totals.carl)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="section-title">Übersicht</p>
        <h1 className="page-title">Catan Saison</h1>
        <p className="text-stone-400 font-body mt-1">
          {gameNights.length} Abende · {totals.games} Spiele
        </p>
      </div>

      {/* Player Stat Cards — stacked on mobile */}
      <div className="grid grid-cols-1 gap-3">
        {PLAYER_LIST.map((player) => (
          <StatCard
            key={player.id}
            player={player}
            wins={totals[player.id]}
            total={totals.games}
            streak={getStreak(player.id)}
            isLeader={totals[player.id] === maxWins && maxWins > 0}
          />
        ))}
      </div>

      {/* Win share bar */}
      <div className="card">
        <p className="section-title">Siegverteilung</p>
        <div className="flex items-center gap-3 mb-3">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="font-display text-[10px] tracking-wider" style={{ color: p.color }}>{p.short}</span>
              <span className="font-mono font-bold text-stone-200">{totals[p.id]}</span>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-stone-800">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="h-full"
              style={{ width: `${totals.games ? (totals[p.id] / totals.games) * 100 : 33}%`, background: p.color }} />
          ))}
        </div>
      </div>

      {/* Cumulative Line Chart */}
      <div className="card">
        <p className="section-title">Kumulative Siege</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cumulativeData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatMonthShort} interval={5} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {PLAYER_LIST.map(p => (
              <Line key={p.id} type="monotone" dataKey={p.id}
                stroke={p.color} strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: p.color }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: p.color }} />
              <span className="font-display text-[10px] tracking-wider" style={{ color: p.color }}>{p.short}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="card">
        <p className="section-title">Siege pro Monat</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 9 }} interval={1} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="card p-3 text-sm">
                  <div className="font-display text-[10px] text-stone-400 mb-2 tracking-wider">{formatMonth(label)}</div>
                  {payload.map(p => (
                    <div key={p.dataKey} className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                      <span className="font-body text-stone-300">
                        {PLAYERS[p.dataKey]?.short}: <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )
            }} />
            {PLAYER_LIST.map(p => (
              <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[2, 2, 0, 0]} opacity={0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Game Nights */}
      <div className="card">
        <p className="section-title">Letzte Abende</p>
        <div className="space-y-2">
          {recentNights.map((gn) => {
            const winner = PLAYER_LIST.reduce((a, b) => gn[a.id] >= gn[b.id] ? a : b)
            return (
              <div key={gn.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-stone-800/40 border border-stone-700/30">
                <div className="font-mono text-stone-500 text-xs">{formatDateShort(gn.date)}</div>
                <div className="flex items-center gap-3">
                  {PLAYER_LIST.map(p => (
                    <div key={p.id} className="flex items-center gap-1">
                      <span className="text-[10px] font-display" style={{ color: `${p.color}80` }}>{p.short}</span>
                      <span className="font-mono font-bold text-sm"
                        style={{ color: gn[p.id] === Math.max(gn.dominic, gn.dante, gn.carl) && gn[p.id] > 0 ? p.color : '#6B5A47' }}>
                        {gn[p.id]}
                      </span>
                    </div>
                  ))}
                </div>
                {gn[winner.id] > 0 && (
                  <div className="text-[10px] font-display tracking-wide" style={{ color: winner.color }}>
                    {winner.short} ↑
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
