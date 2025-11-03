import { useState, useEffect } from 'react'
import { ACHIEVEMENTS, RARITY_COLORS } from '../utils/achievementSystem'

function AchievementNotification({ achievement, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => {
          if (onClose && typeof onClose === 'function') {
            onClose()
          }
        }, 300) // Wait for animation
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const achievementData = (achievement?.id && ACHIEVEMENTS[achievement.id]) || achievement || {}
  const rarityColor = (achievementData.rarity && RARITY_COLORS[achievementData.rarity]) || '#666'

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: `3px solid ${rarityColor}`,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '300px',
      transform: visible ? 'translateX(0)' : 'translateX(400px)',
      transition: 'transform 0.3s ease-in-out',
      animation: visible ? 'bounce 0.6s ease-in-out' : 'none'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>
          🎉 Achievement Unlocked!
        </div>
        
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
          {(achievementData && achievementData.emoji) || '🏆'}
        </div>
        
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
          {(achievementData && achievementData.name) || 'Achievement'}
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          {(achievementData && achievementData.description) || 'Great job!'}
        </div>
        
        <div style={{
          background: rarityColor,
          color: 'white',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          display: 'inline-block'
        }}>
          {(achievementData && achievementData.rarity) || 'common'} • +{(achievementData && achievementData.points) || 0} pts
        </div>
      </div>
      
      <button 
        onClick={() => {
          try {
            setVisible(false)
            setTimeout(() => {
              if (onClose && typeof onClose === 'function') {
                onClose()
              }
            }, 300)
          } catch (error) {
            console.error('Error closing achievement notification:', error)
          }
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#999'
        }}
      >
        ×
      </button>
      

    </div>
  )
}

export default AchievementNotification