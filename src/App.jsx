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
      {/* pb-20 = space for mobile bottom tab bar */}
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
