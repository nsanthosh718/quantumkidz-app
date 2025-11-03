import { useState } from 'react'
import WeeklyChallenge from './WeeklyChallenge'
import AchievementSystem from './AchievementSystem'
import StreakTracker from './StreakTracker'

function ChallengesHub({ kid }) {
  const [activeSection, setActiveSection] = useState('weekly')

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🏆 Challenges & Rewards</h3>
      
      {/* Sub-navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveSection('weekly')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'weekly' ? '#2196F3' : '#f0f0f0',
              color: activeSection === 'weekly' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🏆 Weekly Tournament
          </button>
          <button 
            onClick={() => setActiveSection('streaks')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'streaks' ? '#FF9800' : '#f0f0f0',
              color: activeSection === 'streaks' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🔥 Streaks & Bonuses
          </button>
          <button 
            onClick={() => setActiveSection('badges')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'badges' ? '#4CAF50' : '#f0f0f0',
              color: activeSection === 'badges' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🏅 Badge Collection
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'weekly' && <WeeklyChallenge kid={kid} />}
      {activeSection === 'streaks' && <StreakTracker kid={kid} />}
      {activeSection === 'badges' && <AchievementSystem kid={kid} />}
    </div>
  )
}

export default ChallengesHub