import { NavLink } from 'react-router-dom'

const HexIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M14 2L25 8.5V21.5L14 28L3 21.5V8.5L14 2Z"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="1.5"
    />
    <path
      d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z"
      fill="rgba(245,158,11,0.15)"
      stroke="rgba(245,158,11,0.4)"
      strokeWidth="1"
    />
  </svg>
)

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/history', label: 'Historie' },
  { to: '/duo', label: 'Duo' },
  { to: '/analytics', label: 'Analyse' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-700/40"
      style={{ background: 'rgba(12,10,8,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <HexIcon />
          <div>
            <div className="font-display font-bold text-stone-100 tracking-widest text-sm leading-none">
              CATAN STATS
            </div>
            <div className="font-mono text-[10px] text-stone-500 tracking-wider mt-0.5">
              Dome · Dante · Carl
            </div>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active !text-dominic bg-dominic/8' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
