import { Routes, Route, Navigate } from 'react-router-dom'
import { useGameData } from './hooks/useGameData'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import DuoLists from './pages/DuoLists'
import Analytics from './pages/Analytics'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <svg width="56" height="56" viewBox="0 0 28 28" fill="none" className="animate-pulse">
        <path d="M14 2L25 8.5V21.5L14 28L3 21.5V8.5L14 2Z" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      </svg>
      <div className="font-display tracking-[0.3em] text-stone-500 text-sm uppercase">Lade Daten…</div>
    </div>
  )
}

function SyncIndicator({ syncing, offline }) {
  if (!syncing && !offline) return null
  return (
    <div className="fixed top-14 right-3 z-40 sm:top-16">
      {offline ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/95 border border-dante/40 text-xs font-display tracking-wider text-dante">
          <span className="w-1.5 h-1.5 rounded-full bg-dante" />
          Offline
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/95 border border-dominic/30 text-xs font-display tracking-wider text-dominic/80">
          <span className="w-1.5 h-1.5 rounded-full bg-dominic animate-pulse" />
          Speichert…
        </div>
      )}
    </div>
  )
}

export default function App() {
  const gameData = useGameData()

  if (gameData.loading) return <LoadingScreen />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SyncIndicator syncing={gameData.syncing} offline={gameData.offline} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-5 pb-24 sm:px-6 sm:py-8 sm:pb-8">
        <Routes>
          <Route path="/" element={<Dashboard {...gameData} />} />
          <Route path="/history" element={<History {...gameData} />} />
          <Route path="/duo" element={<DuoLists {...gameData} />} />
          <Route path="/analytics" element={<Analytics {...gameData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
