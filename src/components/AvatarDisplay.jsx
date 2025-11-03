import { useState, useEffect } from 'react'
import { getUserAvatar, renderAvatar, getPetGrowthLevel } from '../utils/avatarSystem'

function AvatarDisplay({ kidId, size = 'medium', showName = false, showPet = true }) {
  const [avatar, setAvatar] = useState(null)
  const [petGrowth, setPetGrowth] = useState(null)

  useEffect(() => {
    try {
      if (kidId) {
        const userAvatar = getUserAvatar(kidId)
        const growth = getPetGrowthLevel(kidId)
        setAvatar(userAvatar || null)
        setPetGrowth(growth || null)
      }
    } catch (error) {
      console.error('Error loading avatar:', error)
      setAvatar(null)
      setPetGrowth(null)
    }
  }, [kidId])

  if (!kidId || !avatar) return null

  let renderedAvatar
  try {
    renderedAvatar = renderAvatar(avatar, size)
  } catch (error) {
    console.error('Error rendering avatar:', error)
    return null
  }
  
  if (!renderedAvatar) return null
  
  const containerSize = {
    small: '32px',
    medium: '64px', 
    large: '96px',
    xlarge: '128px'
  }

  return (
    <div style={{ 
      display: 'inline-block',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ 
        width: containerSize[size],
        height: containerSize[size],
        position: 'relative',
        display: 'inline-block'
      }}>
        {/* Main Avatar */}
        <span style={{ 
          fontSize: renderedAvatar.size,
          lineHeight: '1',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          {renderedAvatar.face}
        </span>
        
        {/* Outfit */}
        {renderedAvatar.outfit && (
          <span style={{ 
            fontSize: `calc(${renderedAvatar.size} * 0.5)`,
            position: 'absolute',
            top: '60%',
            left: '60%',
            transform: 'translate(-50%, -50%)'
          }}>
            {renderedAvatar.outfit}
          </span>
        )}
        
        {/* Accessory */}
        {renderedAvatar.accessory && (
          <span style={{ 
            fontSize: `calc(${renderedAvatar.size} * 0.4)`,
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {renderedAvatar.accessory}
          </span>
        )}
        
        {/* Pet */}
        {showPet && renderedAvatar.pet && (
          <span style={{ 
            fontSize: `calc(${renderedAvatar.size} * 0.5)`,
            position: 'absolute',
            bottom: '0',
            right: '0',
            transform: 'translate(25%, 25%)'
          }}>
            {renderedAvatar.pet}
            {petGrowth && petGrowth.bonus && (
              <span style={{ 
                fontSize: `calc(${renderedAvatar.size} * 0.25)`,
                position: 'absolute',
                top: '-5px',
                right: '-5px'
              }}>
                {petGrowth.bonus}
              </span>
            )}
          </span>
        )}
      </div>
      
      {/* Avatar Name */}
      {showName && (
        <div style={{ 
          fontSize: size === 'small' ? '10px' : '12px',
          marginTop: '4px',
          fontWeight: 'bold'
        }}>
          {avatar.name}
        </div>
      )}
    </div>
  )
}

export default AvatarDisplay