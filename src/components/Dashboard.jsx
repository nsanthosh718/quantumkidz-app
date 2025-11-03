import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getKid, getFilteredMissions, completeMission, uncompleteMission, refreshDailyMissions, getTransactions } from '../utils/storage'
import { updateWeeklyProgress, updateLeaderboard } from '../utils/weeklyChallenge'
import { checkAchievements } from '../utils/achievementSystem'
import { updateAvatarMood, feedPet } from '../utils/avatarSystem'
import { updateStreak, checkStreakReward, calculateStreakBonus } from '../utils/streakSystem'
import { updateKid } from '../utils/storage'
import MissionCard from './MissionCard'
import BalanceDisplay from './BalanceDisplay'
import MoneyActions from './MoneyActions'
import AppBanner from './AppBanner'
import Calendar from './Calendar'
import History from './History'
import AIInsights from './AIInsights'
import StockMarket from './StockMarket'
import WeeklyChallenge from './WeeklyChallenge'
import AchievementSystem from './AchievementSystem'
import AchievementNotification from './AchievementNotification'
import AvatarCustomization from './AvatarCustomization'
import AvatarDisplay from './AvatarDisplay'
import StoryMode from './StoryMode'
import StreakTracker from './StreakTracker'
import ChallengesHub from './ChallengesHub'
import PlayHub from './PlayHub'
import ProfileHub from './ProfileHub'
import WalletHub from './WalletHub'

function Dashboard() {
  const { kidId } = useParams()
  const [kid, setKid] = useState(null)
  const [missions, setMissions] = useState([])
  const [activeTab, setActiveTab] = useState('today')
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [newAchievement, setNewAchievement] = useState(null)

  useEffect(() => {
    try {
      if (!kidId) return
      
      const kidData = getKid(kidId)
      if (!kidData) {
        console.error('Kid not found:', kidId)
        return
      }
      
      setKid(kidData)
      refreshDailyMissions()
      setMissions(getFilteredMissions(kidData.age))
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }, [kidId])

  const handleMissionComplete = (missionId, notes = '') => {
    try {
      if (!kidId || !missionId) return
      
      completeMission(kidId, missionId, notes)
      
      // Update weekly challenge progress
      updateWeeklyProgress(kidId, 'mission_hero')
      updateLeaderboard(kidId, kid.name, 10) // 10 points per mission
      
      // Check for new achievements
      const stats = {
        totalMissions: (kid.completedMissions?.length || 0) + 1,
        totalCoins: kid.coins || 0,
        lastMissionTime: new Date().toISOString()
      }
      const newAchievements = checkAchievements(kidId, stats)
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0])
        updateAvatarMood(kidId, 'achievement_unlock')
      }
      
      // Update avatar mood and feed pet
      updateAvatarMood(kidId, 'mission_complete')
      feedPet(kidId, 2)
      
      // Update mission streak
      const missionStreak = updateStreak(kidId, 'mission', true)
      const streakReward = checkStreakReward(kidId, 'mission', missionStreak.current)
      if (streakReward) {
        const updatedKid = getKid(kidId)
        if (updatedKid) {
          const bonusCoins = streakReward.coins + calculateStreakBonus(kidId, 'mission', streakReward.coins)
          const updatedKidWithBonus = { ...updatedKid, coins: updatedKid.coins + bonusCoins }
          updateKid(updatedKidWithBonus)
          alert(`🔥 ${missionStreak.current} day streak! Bonus: +${bonusCoins} coins!`)
        }
      }
      
      const updatedKid = getKid(kidId)
      if (updatedKid) {
        setKid(updatedKid)
        setMissions(getFilteredMissions(updatedKid.age))
      }
    } catch (error) {
      console.error('Error completing mission:', error)
    }
  }

  const handleMissionUncomplete = (missionId) => {
    if (confirm('Mark this mission as incomplete? You will lose the coins.')) {
      uncompleteMission(kidId, missionId)
      setKid(getKid(kidId)) // Refresh kid data
      setMissions(getFilteredMissions(kid.age)) // Refresh missions
    }
  }

  const getMissionsForDay = (dayOfWeek) => {
    return missions.filter(mission => {
      // If mission has weekly schedule, use that
      if (mission.weeklyDays && mission.weeklyDays.length > 0) {
        return mission.weeklyDays.includes(dayOfWeek)
      }
      // Fallback to old logic for missions without weekly schedule
      if (mission.type === 'chore') return dayOfWeek === 0 || dayOfWeek === 6
      if (mission.type === 'math') return dayOfWeek >= 1 && dayOfWeek <= 5
      return dayOfWeek % 2 === 0
    })
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  const getDateForDay = (dayOfWeek) => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = dayOfWeek - currentDay
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!kid) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Loading Dashboard...</h2>
          <p>Getting your progress ready!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppBanner />
      <div className="card slide-in">
        <div className="text-center mb-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
            <AvatarDisplay kidId={kid.id} size="large" />
            <div>
              <h2>Hi {kid.name}! 👋</h2>
            </div>
          </div>
          <BalanceDisplay kid={kid} />
        </div>
        
        <div className="nav tab-switch">
          <button 
            className={activeTab === 'today' ? 'active' : ''}
            onClick={() => setActiveTab('today')}
          >
            🎯 Today
          </button>
          <button 
            className={activeTab === 'play' ? 'active' : ''}
            onClick={() => setActiveTab('play')}
          >
            🎮 Play
          </button>
          <button 
            className={activeTab === 'challenges' ? 'active' : ''}
            onClick={() => setActiveTab('challenges')}
          >
            🏆 Challenges
          </button>
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={activeTab === 'wallet' ? 'active' : ''}
            onClick={() => setActiveTab('wallet')}
          >
            💰 Wallet
          </button>
        </div>
      </div>

      {activeTab === 'today' && (
        <div className="tab-switch">
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Filter by day:</label>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            >
              {dayNames.map((day, index) => (
                <option key={index} value={index}>{day} ({getDateForDay(index)})</option>
              ))}
            </select>
          </div>
          
          <div className="mission-grid">
            {getMissionsForDay(selectedDay).map(mission => (
              <MissionCard 
                key={mission.id}
                mission={mission}
                isCompleted={kid.completedMissions.includes(mission.id)}
                onComplete={(notes) => handleMissionComplete(mission.id, notes)}
                onUncomplete={() => handleMissionUncomplete(mission.id)}
                kidAge={kid.age}
                completionNotes={getTransactions().find(t => t.kidId === kidId && t.description === mission.title)?.notes}
              />
            ))}
          </div>
          
          {getMissionsForDay(selectedDay).length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No missions scheduled for {dayNames[selectedDay]}
            </div>
          )}
        </div>
      )}

      {activeTab === 'play' && <div className="tab-switch"><PlayHub kid={kid} /></div>}

      {activeTab === 'challenges' && <div className="tab-switch"><ChallengesHub kid={kid} /></div>}

      {activeTab === 'profile' && <div className="tab-switch"><ProfileHub kid={kid} /></div>}

      {activeTab === 'wallet' && <div className="tab-switch"><WalletHub kid={kid} /></div>}

      {newAchievement && (
        <AchievementNotification 
          achievement={newAchievement} 
          onClose={() => setNewAchievement(null)} 
        />
      )}



      <div className="card text-center">
        <Link to="/">
          <button className="btn btn-secondary">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard