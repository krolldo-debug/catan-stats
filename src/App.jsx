import { Routes, Route, Navigate } from 'react-router-dom'
import { useGameData } from './hooks/useGameData'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import DuoLists from './pages/DuoLists'
import Analytics from './pages/Analytics'

export default function App() {
  const gameData = useGameData()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard {...gameData} />} />
          <Route path="/history" element={<History {...gameData} />} />
          <Route path="/duo" element={<DuoLists {...gameData} />} />
          <Route path="/analytics" element={<Analytics {...gameData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center py-6 text-stone-600 text-sm font-body">
        <span className="font-display tracking-widest text-xs text-stone-700">CATAN STATS</span>
        <span className="mx-3 text-stone-800">·</span>
        <span className="text-dominic/50">Dome</span>
        <span className="mx-1 text-stone-800">×</span>
        <span className="text-dante/50">Dante</span>
        <span className="mx-1 text-stone-800">×</span>
        <span className="text-carl/50">Carl</span>
      </footer>
    </div>
  )
}
