import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProfileSelector from './components/ProfileSelector'
import Dashboard from './components/Dashboard'
import ParentConsole from './components/ParentConsole'
import MathGame from './components/MathGame'
import FocusGame from './components/FocusGame'
import GameHub from './components/GameHub'
import UniversalGame from './components/UniversalGame'
import { initializeData } from './utils/storage'
import { updateStreak } from './utils/streakSystem'

function App() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      initializeData()
      
      // Update login streak for all kids
      const kids = JSON.parse(localStorage.getItem('kids') || '[]')
      kids.forEach(kid => {
        updateStreak(kid.id, 'login', true)
      })
      
      setInitialized(true)
    } catch (error) {
      console.error('Failed to initialize app:', error)
      setInitialized(true) // Still show app even if initialization fails
    }
  }, [])

  if (!initialized) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>⚡ QuantumKidz</h2>
          <p>Loading your financial adventure...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<ProfileSelector />} />
          <Route path="/dashboard/:kidId" element={<Dashboard />} />
          <Route path="/parent" element={<ParentConsole />} />
          <Route path="/games/:kidId" element={<GameHub />} />
          <Route path="/games/math/:kidId" element={<MathGame />} />
          <Route path="/games/focus/:kidId" element={<FocusGame />} />
          <Route path="/games/:gameType/:kidId" element={<UniversalGame />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App