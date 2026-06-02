import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from 'recharts'
import { PLAYERS } from '../data/initialData'

const PLAYER_LIST = Object.values(PLAYERS)

function formatMonth(m) {
  const [y, mo] = m.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return `${months[parseInt(mo)]} '${y.slice(2)}`
}

function formatMonthShort(d) {
  const [, m] = d.split('-')
  const months = ['', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  return months[parseInt(m)]
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-sm">
      <div className="font-display text-[10px] text-stone-400 mb-2 tracking-wider">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-body text-stone-300">
            {PLAYERS[p.dataKey]?.short || p.name}:{' '}
            <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontFamily: 'Cinzel, serif', fontSize: 11, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function Analytics({ totals, cumulativeData, monthlyData, last10, gameNights }) {
  const pieData = PLAYER_LIST.map(p => ({ name: p.short, value: totals[p.id], color: p.color }))

  const formData = last10.map(gn => ({
    date: formatMonthShort(gn.date),
    dominic: gn.dominic,
    dante: gn.dante,
    carl: gn.carl,
  }))

  const avgPerNight = PLAYER_LIST.reduce((acc, p) => {
    acc[p.id] = gameNights.length > 0 ? (totals[p.id] / gameNights.length).toFixed(2) : '0.00'
    return acc
  }, {})

  const droughtCount = PLAYER_LIST.reduce((acc, p) => {
    acc[p.id] = gameNights.filter(gn => gn[p.id] === 0).length
    return acc
  }, {})

  const bestNight = PLAYER_LIST.reduce((acc, p) => {
    acc[p.id] = gameNights.reduce((best, gn) => (!best || gn[p.id] > best[p.id] ? gn : best), null)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div>
        <p className="section-title">Statistiken</p>
        <h1 className="page-title">Analyse</h1>
        <p className="text-stone-400 font-body mt-1 text-sm">{gameNights.length} Abende ausgewertet</p>
      </div>

      {/* Per-player stat cards */}
      {PLAYER_LIST.map(p => (
        <div key={p.id} className="card" style={{ borderColor: `${p.color}25` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="font-display text-xs tracking-widest uppercase" style={{ color: p.color }}>{p.name}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="font-mono font-bold text-lg text-stone-200">{totals[p.id]}</div>
              <div className="text-stone-600 text-[10px]">Siege</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-lg text-stone-200">{avgPerNight[p.id]}</div>
              <div className="text-stone-600 text-[10px]">Ø/Abend</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-lg" style={{ color: p.color }}>{bestNight[p.id]?.[p.id] ?? 0}</div>
              <div className="text-stone-600 text-[10px]">Bestabend</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-lg text-stone-200">{droughtCount[p.id]}</div>
              <div className="text-stone-600 text-[10px]">Nullnächte</div>
            </div>
          </div>
        </div>
      ))}

      {/* Cumulative wins */}
      <div className="card">
        <p className="section-title">Kumulative Siege</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cumulativeData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatMonthShort} interval={5} tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {PLAYER_LIST.map(p => (
              <Line key={p.id} type="monotone" dataKey={p.id}
                stroke={p.color} strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: p.color, stroke: '#0C0A08', strokeWidth: 2 }} />
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

      {/* Pie chart */}
      <div className="card">
        <p className="section-title">Sieganteil gesamt</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={85}
              paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="card p-3 text-sm">
                  <span style={{ color: d.color }} className="font-display tracking-wider">{d.name}</span>
                  <span className="text-stone-300 ml-2 font-mono font-bold">{d.value}</span>
                </div>
              )
            }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-5">
          {pieData.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              <span className="font-display text-[10px] tracking-wider" style={{ color: d.color }}>{d.name}</span>
              <span className="font-mono text-sm font-bold text-stone-300">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form — last 10 nights */}
      <div className="card">
        <p className="section-title">Form — letzte 10 Abende</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={formData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {PLAYER_LIST.map(p => (
              <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[2, 2, 0, 0]} opacity={0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {PLAYER_LIST.map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded" style={{ background: p.color }} />
              <span className="font-display text-[10px] tracking-wider" style={{ color: p.color }}>{p.short}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly table */}
      <div className="card">
        <p className="section-title">Monatsübersicht</p>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[280px]">
            <thead>
              <tr className="border-b border-stone-700/50">
                <th className="text-left py-2 pr-3 text-stone-500 font-display text-[10px] tracking-wider">Monat</th>
                {PLAYER_LIST.map(p => (
                  <th key={p.id} className="text-center py-2 px-2 font-display text-[10px] tracking-wider" style={{ color: p.color }}>
                    {p.short}
                  </th>
                ))}
                <th className="text-center py-2 px-2 text-stone-600 font-display text-[10px] tracking-wider">∑</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(row => {
                const rowMax = Math.max(row.dominic, row.dante, row.carl)
                const rowTotal = row.dominic + row.dante + row.carl
                return (
                  <tr key={row.month} className="border-b border-stone-800/50">
                    <td className="py-2 pr-3 font-mono text-stone-400 text-[11px]">{formatMonth(row.month)}</td>
                    {PLAYER_LIST.map(p => (
                      <td key={p.id} className="text-center py-2 px-2 font-mono font-bold text-sm"
                        style={{ color: row[p.id] === rowMax && row[p.id] > 0 ? p.color : '#524537' }}>
                        {row[p.id]}
                      </td>
                    ))}
                    <td className="text-center py-2 px-2 font-mono text-stone-600 text-xs">{rowTotal}</td>
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
