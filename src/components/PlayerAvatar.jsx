import { useState } from 'react'

// Circular player photo with a graceful fallback (colored monogram) and an
// optional crown for the current 1v1v1 leader.
export default function PlayerAvatar({ player, size = 48, crown = false, ring = true }) {
  const [error, setError] = useState(false)
  const dim = `${size}px`
  const showImg = player.photo && !error

  return (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      {crown && (
        <span
          className="absolute left-1/2 -translate-x-1/2 z-10 select-none"
          style={{ top: `-${Math.round(size * 0.28)}px`, fontSize: `${Math.round(size * 0.46)}px`, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}
          role="img"
          aria-label="Spitzenreiter"
        >
          👑
        </span>
      )}

      {showImg ? (
        <img
          src={player.photo}
          alt={player.name}
          onError={() => setError(true)}
          className="w-full h-full object-cover rounded-full"
          style={ring ? { boxShadow: `0 0 0 2px ${player.color}, 0 2px 8px rgba(0,0,0,0.4)` } : undefined}
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-display font-bold uppercase"
          style={{
            background: `linear-gradient(135deg, ${player.color}, ${player.colorDark})`,
            color: '#0C0A08',
            boxShadow: ring ? `0 0 0 2px ${player.color}` : undefined,
            fontSize: `${Math.round(size * 0.34)}px`,
          }}
        >
          {player.short.slice(0, 2)}
        </div>
      )}
    </div>
  )
}
