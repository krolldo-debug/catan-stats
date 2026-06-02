import { NavLink } from 'react-router-dom'

const HexIcon = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L25 8.5V21.5L14 28L3 21.5V8.5L14 2Z" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
  </svg>
)

const links = [
  { to: '/', label: 'Start', icon: '⬡' },
  { to: '/history', label: 'Historie', icon: '📋' },
  { to: '/duo', label: 'Duo', icon: '⚔️' },
  { to: '/analytics', label: 'Analyse', icon: '📊' },
]

export default function Navbar() {
  return (
    <>
      {/* Top bar — logo only on mobile */}
      <header className="sticky top-0 z-50 border-b border-stone-700/40"
        style={{ background: 'rgba(12,10,8,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <HexIcon />
            <span className="font-display font-bold text-stone-100 tracking-widest text-sm">CATAN STATS</span>
          </NavLink>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active !text-dominic' : ''}`
                }>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Bottom tab bar — mobile only */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-stone-700/60"
        style={{ background: 'rgba(12,10,8,0.97)', backdropFilter: 'blur(12px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${isActive ? 'text-dominic' : 'text-stone-500'}`
            }>
            <span className="text-lg leading-none">{icon}</span>
            <span className="font-display text-[9px] tracking-widest uppercase">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
