import { useState, useEffect } from 'react'
import { STREAK_TYPES, STREAK_REWARDS, STREAK_SAVERS, getStreakStats, getStreakPowerUps, useStreakSaver } from '../utils/streakSystem'
import { updateKid } from '../utils/storage'

function StreakTracker({ kid }) {
  const [streakStats, setStreakStats] = useState(null)
  const [powerUps, setPowerUps] = useState(null)
  const [showReward, setShowReward] = useState(null)

  useEffect(() => {
    try {
      if (kid && kid.id) {
        const stats = getStreakStats(kid.id)
        const userPowerUps = getStreakPowerUps(kid.id)
        setStreakStats(stats)
        setPowerUps(userPowerUps)
      }
    } catch (error) {
      console.error('Error loading streak data:', error)
      setStreakStats({ activeStreaks: 0, totalCurrent: 0, longestStreak: 0, streaks: {} })
      setPowerUps({})
    }
  }, [kid])

  const handlePowerUpPurchase = (powerUpType) => {
    try {
      if (!kid || !kid.id || !powerUpType) {
        throw new Error('Invalid parameters')
      }
      
      const powerUp = STREAK_SAVERS[powerUpType]
      if (!powerUp) {
        throw new Error('Invalid power-up type')
      }
      
      if ((kid.coins || 0) >= powerUp.cost) {
        const updatedKid = { ...kid, coins: (kid.coins || 0) - powerUp.cost }
        updateKid(updatedKid)
        
        const newPowerUps = { ...powerUps }
        newPowerUps[powerUpType] = (newPowerUps[powerUpType] || 0) + 1
        setPowerUps(newPowerUps)
        
        alert(`Purchased ${powerUp.name}!`)
      } else {
        alert(`Not enough coins! You need ${powerUp.cost} coins.`)
      }
    } catch (error) {
      console.error('Error purchasing power-up:', error)
      alert('Failed to purchase power-up. Please try again.')
    }
  }

  const handlePowerUpUse = (streakType, powerUpType) => {
    try {
      if (!kid || !kid.id || !streakType || !powerUpType) {
        throw new Error('Invalid parameters')
      }
      
      if (!powerUps || (powerUps[powerUpType] || 0) <= 0) {
        alert('No power-ups available!')
        return
      }
      
      const success = useStreakSaver(kid.id, streakType, powerUpType)
      if (success) {
        const newPowerUps = { ...powerUps }
        newPowerUps[powerUpType] = Math.max(0, (newPowerUps[powerUpType] || 0) - 1)
        setPowerUps(newPowerUps)
        
        // Refresh streak stats
        const stats = getStreakStats(kid.id)
        setStreakStats(stats)
        
        const powerUpName = STREAK_SAVERS[powerUpType]?.name || 'Power-up'
        alert(`Used ${powerUpName}!`)
      } else {
        alert('Failed to use power-up. Please try again.')
      }
    } catch (error) {
      console.error('Error using power-up:', error)
      alert('Failed to use power-up. Please try again.')
    }
  }

  if (!kid) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🔥 Streak Tracker</h3>
        <p>Please select a kid profile to view streaks.</p>
      </div>
    )
  }
  
  if (!streakStats || !powerUps) return <div>Loading...</div>

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🔥 Streak Tracker</h3>
      
      {/* Overall Stats */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{streakStats.activeStreaks}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Active Streaks</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{streakStats.totalCurrent}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Days</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{streakStats.longestStreak}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Best Streak</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>🔥</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Streak Master</div>
          </div>
        </div>
      </div>

      {/* Individual Streaks */}
      <div style={{ marginBottom: '24px' }}>
        <h4>📊 Your Streaks</h4>
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(STREAK_TYPES).map(([type, info]) => {
            const streak = streakStats.streaks[type]
            const nextReward = Object.entries(STREAK_REWARDS).find(([days]) => parseInt(days) > streak.current)
            
            return (
              <div key={type} style={{
                background: streak.current > 0 ? '#fff3e0' : '#f8f9fa',
                border: `2px solid ${streak.current > 0 ? '#FF9800' : '#ddd'}`,
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{info.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Current: {streak.current} days • Best: {streak.best} days
                      </div>
                    </div>
                  </div>
                  
                  {streak.current > 0 && (
                    <div style={{
                      background: '#FF9800',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {streak.current} 🔥
                    </div>
                  )}
                </div>
                
                {/* Progress to Next Reward */}
                {nextReward && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      Next reward at {nextReward[0]} days: +{nextReward[1].coins} coins
                    </div>
                    <div style={{
                      background: '#e0e0e0',
                      borderRadius: '10px',
                      height: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: '#FF9800',
                        width: `${(streak.current / parseInt(nextReward[0])) * 100}%`,
                        height: '100%',
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>
                )}
                
                {/* Power-Up Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(STREAK_SAVERS).map(([powerType, powerInfo]) => (
                    <button
                      key={powerType}
                      onClick={() => handlePowerUpUse(type, powerType)}
                      disabled={powerUps[powerType] === 0}
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '12px',
                        background: powerUps[powerType] > 0 ? '#4CAF50' : '#ccc',
                        color: 'white',
                        fontSize: '10px',
                        cursor: powerUps[powerType] > 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {powerInfo.name} ({powerUps[powerType]})
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Streak Rewards */}
      <div style={{ marginBottom: '24px' }}>
        <h4>🏆 Streak Rewards</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
          {Object.entries(STREAK_REWARDS).map(([days, reward]) => {
            const hasAchieved = streakStats.longestStreak >= parseInt(days)
            
            return (
              <div key={days} style={{
                background: hasAchieved ? '#e8f5e8' : '#f8f9fa',
                border: `2px solid ${hasAchieved ? '#4CAF50' : '#ddd'}`,
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                opacity: hasAchieved ? 1 : 0.6
              }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                  {reward.emoji}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {days} Days
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  +{reward.coins} coins
                </div>
                <div style={{ fontSize: '10px', marginTop: '4px' }}>
                  {reward.title}
                </div>
                {hasAchieved && (
                  <div style={{ fontSize: '16px', marginTop: '4px' }}>✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Power-Up Shop */}
      <div>
        <h4>⚡ Streak Savers Shop</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {Object.entries(STREAK_SAVERS).map(([type, saver]) => (
            <div key={type} style={{
              background: 'white',
              border: '2px solid #ddd',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{saver.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{saver.description}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Owned: {powerUps[type] || 0}
                </div>
              </div>
              
              <button
                onClick={() => handlePowerUpPurchase(type)}
                disabled={kid.coins < saver.cost}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: kid.coins >= saver.cost ? '#2196F3' : '#ccc',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: kid.coins >= saver.cost ? 'pointer' : 'not-allowed'
                }}
              >
                {saver.cost} 💰
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coins Display */}
      <div style={{
        background: '#fff3e0',
        padding: '16px',
        borderRadius: '12px',
        marginTop: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          💰 Your Coins: {kid.coins}
        </div>
      </div>
    </div>
  )
}

export default StreakTracker