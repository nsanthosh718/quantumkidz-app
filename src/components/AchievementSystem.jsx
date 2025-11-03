import { useState, useEffect } from 'react'
import { ACHIEVEMENTS, RARITY_COLORS, getUserAchievements, getAchievementStats } from '../utils/achievementSystem'

function AchievementSystem({ kid }) {
  const [userAchievements, setUserAchievements] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showUnlocked, setShowUnlocked] = useState(true)

  useEffect(() => {
    try {
      if (kid && kid.id) {
        const achievements = getUserAchievements(kid.id)
        const achievementStats = getAchievementStats(kid.id)
        setUserAchievements(Array.isArray(achievements) ? achievements : [])
        setStats(achievementStats || { total: 0, totalPoints: 0, completion: 0, rarityCount: {} })
      }
    } catch (error) {
      console.error('Error loading achievements:', error)
      setUserAchievements([])
      setStats({ total: 0, totalPoints: 0, completion: 0, rarityCount: {} })
    }
  }, [kid])

  const filteredAchievements = Object.values(ACHIEVEMENTS || {}).filter(achievement => {
    if (!achievement || !achievement.id) return false
    if (filter !== 'all' && achievement.rarity !== filter) return false
    if (!showUnlocked && userAchievements.includes(achievement.id)) return false
    if (showUnlocked === 'only' && !userAchievements.includes(achievement.id)) return false
    return true
  })

  if (!kid) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🏅 Achievement Gallery</h3>
        <p>Please select a kid profile to view achievements.</p>
      </div>
    )
  }
  
  if (!stats) return <div>Loading...</div>

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🏅 Achievement Gallery</h3>
      
      {/* Stats Overview */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '16px', 
        borderRadius: '12px', 
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px' }}>Unlocked</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
              {stats.totalPoints}
            </div>
            <div style={{ fontSize: '12px' }}>Points</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.completion}%
            </div>
            <div style={{ fontSize: '12px' }}>Complete</div>
          </div>
        </div>
        
        {/* Rarity Breakdown */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Collection:</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.entries(stats.rarityCount).map(([rarity, count]) => (
              <div key={rarity} style={{
                background: RARITY_COLORS[rarity],
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {rarity}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              background: filter === 'all' ? '#2196F3' : '#f0f0f0',
              color: filter === 'all' ? 'white' : '#666',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {Object.keys(RARITY_COLORS).map(rarity => (
            <button 
              key={rarity}
              onClick={() => setFilter(rarity)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: 'none',
                background: filter === rarity ? RARITY_COLORS[rarity] : '#f0f0f0',
                color: filter === rarity ? 'white' : '#666',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {rarity}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setShowUnlocked(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              background: showUnlocked === true ? '#4CAF50' : '#f0f0f0',
              color: showUnlocked === true ? 'white' : '#666',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            All Badges
          </button>
          <button 
            onClick={() => setShowUnlocked('only')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              background: showUnlocked === 'only' ? '#4CAF50' : '#f0f0f0',
              color: showUnlocked === 'only' ? 'white' : '#666',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Unlocked Only
          </button>
          <button 
            onClick={() => setShowUnlocked(false)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              background: showUnlocked === false ? '#FF9800' : '#f0f0f0',
              color: showUnlocked === false ? 'white' : '#666',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Locked Only
          </button>
        </div>
      </div>

      {/* Achievement Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '16px' 
      }}>
        {filteredAchievements.map(achievement => {
          const isUnlocked = userAchievements.includes(achievement.id)
          
          return (
            <div key={achievement.id} style={{
              background: isUnlocked ? '#fff' : '#f5f5f5',
              border: `2px solid ${RARITY_COLORS[achievement.rarity]}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              opacity: isUnlocked ? 1 : 0.6,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Rarity Banner */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: RARITY_COLORS[achievement.rarity],
                color: 'white',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {achievement.rarity}
              </div>
              
              {/* Achievement Icon */}
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '12px',
                filter: isUnlocked ? 'none' : 'grayscale(100%)'
              }}>
                {achievement.emoji}
              </div>
              
              {/* Achievement Info */}
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: isUnlocked ? '#333' : '#999' 
              }}>
                {achievement.name}
              </h4>
              
              <p style={{ 
                fontSize: '14px', 
                color: isUnlocked ? '#666' : '#999',
                margin: '0 0 12px 0'
              }}>
                {achievement.description}
              </p>
              
              {/* Points */}
              <div style={{
                background: isUnlocked ? RARITY_COLORS[achievement.rarity] : '#ccc',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                +{achievement.points} pts
              </div>
              
              {/* Unlock Status */}
              {isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#4CAF50',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  ✓
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No achievements match your current filter.
        </div>
      )}
    </div>
  )
}

export default AchievementSystem