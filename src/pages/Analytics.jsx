import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { PLAYERS } from '../data/initialData'

const PLAYER_LIST = Object.values(PLAYERS)

function formatMonth(m) {
  const [y, mo] = m.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
}

function formatDateShort(d) {
  const [, m] = d.split('-')
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return months[parseInt(m) - 1]
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-sm border border-stone-600/50">
      <div className="font-display text-xs text-stone-400 mb-2 tracking-wider">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-body text-stone-300">
            {PLAYERS[p.dataKey]?.short || p.name}: <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function Analytics({ totals, cumulativeData, monthlyData, last10, gameNights }) {
  const pieData = PLAYER_LIST.map(p => ({ name: p.short, value: totals[p.id], color: p.color }))

  // Win rate per month for radar
  const last6months = monthlyData.slice(-6)

  // Form: wins in last 10 nights
  const formData = last10.map(gn => ({
    date: formatDateShort(gn.date),
    dominic: gn.dominic,
    dante: gn.dante,
    carl: gn.carl,
  }))

  // Best night per player
  const bestNight = {}
  PLAYER_LIST.forEach(p => {
    bestNight[p.id] = gameNights.reduce((best, gn) => (!best || gn[p.id] > best[p.id] ? gn : best), null)
  })

  // Average wins per night
  const avgPerNight = PLAYER_LIST.reduce((acc, p) => {
    acc[p.id] = gameNights.length > 0 ? (totals[p.id] / gameNights.length).toFixed(2) : '0.00'
    return acc
  }, {})

  // Nights with 0 wins (drought nights)
  const droughtCount = PLAYER_LIST.reduce((acc, p) => {
    acc[p.id] = gameNights.filter(gn => gn[p.id] === 0).length
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="animate-in">
        <p className="section-title">Datenanalyse</p>
        <h1 className="page-title">Statistik & Analyse</h1>
        <p className="text-stone-400 font-body mt-1">{gameNights.length} Spielabende ausgewertet</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4 animate-in stagger-1">
        {PLAYER_LIST.map((p, i) => (
          <div key={p.id} className={`card stagger-${i + 1}`}
            style={{ borderColor: `${p.color}25` }}>
            <div className="section-title" style={{ color: p.color }}>{p.short}</div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <div className="font-mono font-bold text-xl text-stone-200">{avgPerNight[p.id]}</div>
                <div className="text-stone-500 text-[10px] font-body">Ø Siege/Abend</div>
              </div>
              <div>
                <div className="font-mono font-bold text-xl text-stone-200">{droughtCount[p.id]}</div>
                <div className="text-stone-500 text-[10px] font-body">Nullnächte</div>
              </div>
              <div>
                <div className="font-mono font-bold text-xl" style={{ color: p.color }}>
                  {bestNight[p.id]?.[p.id] ?? 0}
                </div>
                <div className="text-stone-500 text-[10px] font-body">Bester Abend</div>
              </div>
              <div>
                <div className="font-mono font-bold text-xl text-stone-200">
                  {totals.games > 0 ? `${((totals[p.id] / totals.games) * 100).toFixed(0)}%` : '–'}
                </div>
                <div className="text-stone-500 text-[10px] font-body">Siegrate</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cumulative wins */}
      <div className="card animate-in stagger-2">
        <p className="section-title">Kumulative Siegerentwicklung</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={cumulativeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateShort} interval={4} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => PLAYERS[v]?.short || v} />
            {PLAYER_LIST.map(p => (
              <Line key={p.id} type="monotone" dataKey={p.id}
                stroke={p.color} strokeWidth={2.5} dot={false}
                activeDot={{ r: 5, fill: p.color, stroke: '#0C0A08', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="card animate-in stagger-3">
          <p className="section-title">Gesamtanteil Siege</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="card p-3 text-sm">
                    <span style={{ color: d.color }} className="font-display tracking-wider">{d.name}</span>
                    <span className="text-stone-300 ml-2 font-mono font-bold">{d.value} Siege</span>
                  </div>
                )
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="font-display text-xs tracking-wider text-stone-400">{d.name}</span>
                <span className="font-mono text-sm font-bold text-stone-300">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form - last 10 nights */}
        <div className="card animate-in stagger-3">
          <p className="section-title">Form — letzte 10 Abende</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={formData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => PLAYERS[v]?.short || v} />
              {PLAYER_LIST.map(p => (
                <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[2, 2, 0, 0]} opacity={0.85} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly performance */}
      <div className="card animate-in stagger-4">
        <p className="section-title">Monatliche Performance</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 10 }} interval={1} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={({ active, payload, label }) => {
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
            }} />
            <Legend formatter={(v) => PLAYERS[v]?.short || v} />
            {PLAYER_LIST.map(p => (
              <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[3, 3, 0, 0]} opacity={0.85} stackId="a" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Head-to-head summary table */}
      <div className="card animate-in stagger-5">
        <p className="section-title">Spielabend-Vergleich nach Monat</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-stone-700/50">
                <th className="text-left py-2 pr-4 text-stone-500 font-display text-xs tracking-wider">Monat</th>
                {PLAYER_LIST.map(p => (
                  <th key={p.id} className="text-center py-2 px-4 font-display text-xs tracking-wider" style={{ color: p.color }}>
                    {p.short}
                  </th>
                ))}
                <th className="text-center py-2 px-4 text-stone-500 font-display text-xs tracking-wider">Ges.</th>
                <th className="text-left py-2 px-4 text-stone-500 font-display text-xs tracking-wider">Stärkster</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(row => {
                const rowTotal = row.dominic + row.dante + row.carl
                const leader = PLAYER_LIST.reduce((a, b) => row[a.id] >= row[b.id] ? a : b)
                return (
                  <tr key={row.month} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-stone-400 text-xs">{formatMonth(row.month)}</td>
                    {PLAYER_LIST.map(p => (
                      <td key={p.id} className="text-center py-2.5 px-4 font-mono font-bold"
                        style={{ color: row[p.id] === Math.max(row.dominic, row.dante, row.carl) ? p.color : '#6B5A47' }}>
                        {row[p.id]}
                      </td>
                    ))}
                    <td className="text-center py-2.5 px-4 font-mono text-stone-500">{rowTotal}</td>
                    <td className="py-2.5 px-4 font-display text-xs tracking-wider" style={{ color: leader.color }}>
                      {leader.short}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
