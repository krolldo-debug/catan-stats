import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid
} from 'recharts'
import { PLAYERS } from '../data/initialData'

const PLAYER_LIST = Object.values(PLAYERS)

function StatCard({ player, wins, total, streak, delay }) {
  const rate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0'
  return (
    <div className={`card animate-in stagger-${delay} relative overflow-hidden`}
      style={{ borderColor: `${player.color}30` }}>
      <div className="absolute inset-0 opacity-10"
        style={{ background: `radial-gradient(ellipse at top right, ${player.color} 0%, transparent 65%)` }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="section-title" style={{ color: player.color }}>
              {player.name}
            </div>
            <div className="stat-number" style={{ color: player.color }}>
              {wins}
            </div>
            <div className="text-stone-400 font-body text-sm mt-1">
              Siege gesamt
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-stone-300">{rate}%</div>
            <div className="text-stone-500 text-xs mt-1 font-body">Siegrate</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-700/50">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: player.color }} />
            <span className="text-stone-400 text-sm font-body">
              Aktuelle Serie: <span className="font-bold" style={{ color: player.color }}>{streak}</span>
            </span>
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
      <div className="font-display text-xs text-stone-400 mb-2 tracking-wider">{label}</div>
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

function formatMonth(m) {
  const [y, mo] = m.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
}

function formatDate(d) {
  const [y, m, day] = d.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} '${y.slice(2)}`
}

export default function Dashboard({ totals, cumulativeData, monthlyData, gameNights, getStreak }) {
  const recentNights = [...gameNights].reverse().slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-in">
        <p className="section-title">Übersicht</p>
        <h1 className="page-title">Catan Saison 2025/26</h1>
        <p className="text-stone-400 font-body mt-2 text-lg">
          {gameNights.length} Spielabende · {totals.games} Spiele insgesamt
        </p>
      </div>

      {/* Player Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAYER_LIST.map((player, i) => (
          <StatCard
            key={player.id}
            player={player}
            wins={totals[player.id]}
            total={totals.games}
            streak={getStreak(player.id)}
            delay={i + 1}
          />
        ))}
      </div>

      {/* Cumulative Line Chart */}
      <div className="card animate-in stagger-4">
        <p className="section-title">Kumulative Siege über Zeit</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={cumulativeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={d => {
                const [,m] = d.split('-')
                const months = ['','Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
                return months[parseInt(m)]
              }}
              interval={3}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => PLAYERS[v]?.short || v} />
            {PLAYER_LIST.map(p => (
              <Line
                key={p.id}
                type="monotone"
                dataKey={p.id}
                stroke={p.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: p.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Bar Chart */}
      <div className="card animate-in stagger-5">
        <p className="section-title">Siege pro Monat</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 10 }} interval={1} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="card p-3 text-sm">
                    <div className="font-display text-xs text-stone-400 mb-2 tracking-wider">{formatMonth(label)}</div>
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
              }}
            />
            <Legend formatter={(v) => PLAYERS[v]?.short || v} />
            {PLAYER_LIST.map(p => (
              <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[3, 3, 0, 0]} opacity={0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Game Nights */}
      <div className="card animate-in stagger-6">
        <p className="section-title">Letzte Spielabende</p>
        <div className="space-y-2">
          {recentNights.map((gn, i) => {
            const top = ['dominic', 'dante', 'carl'].reduce((a, b) => gn[a] >= gn[b] ? a : b)
            return (
              <div key={gn.id}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-stone-800/40 border border-stone-700/30 hover:border-stone-600/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-stone-500 text-xs w-24">{formatDate(gn.date)}</div>
                  <div className="flex items-center gap-3">
                    {PLAYER_LIST.map(p => (
                      <div key={p.id} className="flex items-center gap-1.5">
                        <span className="text-xs font-display tracking-wide" style={{ color: p.color }}>{p.short}</span>
                        <span className="font-mono font-bold text-stone-200 text-sm">{gn[p.id]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-display tracking-wider" style={{ color: PLAYERS[top].color }}>
                  {gn[top] > 0 ? `${PLAYERS[top].short} führt` : 'Unentschieden'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
