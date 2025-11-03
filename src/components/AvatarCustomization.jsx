import { useState, useEffect } from 'react'
import { AVATAR_PARTS, getUserAvatar, saveUserAvatar, getUnlockedItems, unlockItem, getPetGrowthLevel, renderAvatar } from '../utils/avatarSystem'
import { getKid, updateKid } from '../utils/storage'

function AvatarCustomization({ kid }) {
  const [avatar, setAvatar] = useState(null)
  const [unlockedItems, setUnlockedItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('faces')
  const [petGrowth, setPetGrowth] = useState(null)
  const [previewAvatar, setPreviewAvatar] = useState(null)

  useEffect(() => {
    if (kid) {
      const userAvatar = getUserAvatar(kid.id)
      const unlocked = getUnlockedItems(kid.id)
      const growth = getPetGrowthLevel(kid.id)
      
      setAvatar(userAvatar)
      setPreviewAvatar(userAvatar)
      setUnlockedItems(unlocked)
      setPetGrowth(growth)
    }
  }, [kid])

  const handleItemSelect = (category, itemId) => {
    const newAvatar = { ...previewAvatar, [category.slice(0, -1)]: itemId }
    setPreviewAvatar(newAvatar)
  }

  const handlePurchase = (itemId, cost) => {
    if (kid.coins >= cost) {
      const success = unlockItem(kid.id, itemId, cost)
      if (success) {
        // Deduct coins
        const updatedKid = { ...kid, coins: kid.coins - cost }
        updateKid(updatedKid)
        
        // Update unlocked items
        const newUnlocked = [...unlockedItems, itemId]
        setUnlockedItems(newUnlocked)
        
        alert(`Purchased ${AVATAR_PARTS[activeCategory].find(item => item.id === itemId)?.name}!`)
      }
    } else {
      alert(`Not enough coins! You need ${cost} coins.`)
    }
  }

  const saveAvatar = () => {
    saveUserAvatar(kid.id, previewAvatar)
    setAvatar(previewAvatar)
    alert('Avatar saved!')
  }

  const resetPreview = () => {
    setPreviewAvatar(avatar)
  }

  if (!avatar || !previewAvatar) return <div>Loading...</div>

  const renderedAvatar = renderAvatar(previewAvatar, 'xlarge')

  return (
    <div className="card slide-in">
      <h3 className="mb-4">👤 Avatar Customization</h3>
      
      {/* Avatar Preview */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '24px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h4>Your Avatar</h4>
        <div style={{ 
          fontSize: '96px', 
          lineHeight: '1',
          marginBottom: '16px',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Base Character */}
          <span>{renderedAvatar.face}</span>
          
          {/* Outfit Overlay */}
          {renderedAvatar.outfit && (
            <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '48px' }}>
              {renderedAvatar.outfit}
            </span>
          )}
          
          {/* Accessory */}
          {renderedAvatar.accessory && (
            <span style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '36px' }}>
              {renderedAvatar.accessory}
            </span>
          )}
          
          {/* Pet */}
          {renderedAvatar.pet && (
            <span style={{ position: 'absolute', bottom: '0', right: '-20px', fontSize: '48px' }}>
              {renderedAvatar.pet}
              {petGrowth && petGrowth.bonus && (
                <span style={{ fontSize: '24px' }}>{petGrowth.bonus}</span>
              )}
            </span>
          )}
        </div>
        
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          {previewAvatar.name}
        </div>
        
        {petGrowth && previewAvatar.pet !== 'none' && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            Pet Level: {petGrowth.level} ({petGrowth.name})
          </div>
        )}
        
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={saveAvatar}>
            💾 Save Avatar
          </button>
          <button className="btn btn-secondary" onClick={resetPreview}>
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.keys(AVATAR_PARTS).map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: activeCategory === category ? '#2196F3' : '#f0f0f0',
                color: activeCategory === category ? 'white' : '#666',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
        gap: '16px' 
      }}>
        {AVATAR_PARTS[activeCategory].map(item => {
          const isUnlocked = unlockedItems.includes(item.id)
          const isSelected = previewAvatar[activeCategory.slice(0, -1)] === item.id
          const canAfford = kid.coins >= item.cost
          
          return (
            <div key={item.id} style={{
              background: isSelected ? '#e3f2fd' : 'white',
              border: `2px solid ${isSelected ? '#2196F3' : '#ddd'}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              cursor: isUnlocked ? 'pointer' : 'default',
              opacity: isUnlocked ? 1 : 0.6,
              position: 'relative'
            }}>
              {/* Item Icon */}
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '8px',
                filter: isUnlocked ? 'none' : 'grayscale(100%)'
              }}>
                {item.emoji || '❓'}
              </div>
              
              {/* Item Name */}
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {item.name}
              </div>
              
              {/* Action Button */}
              {isUnlocked ? (
                <button 
                  onClick={() => handleItemSelect(activeCategory, item.id)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    background: isSelected ? '#4CAF50' : '#2196F3',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </button>
              ) : (
                <button 
                  onClick={() => handlePurchase(item.id, item.cost)}
                  disabled={!canAfford}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    background: canAfford ? '#FF9800' : '#ccc',
                    color: 'white',
                    fontSize: '12px',
                    cursor: canAfford ? 'pointer' : 'not-allowed'
                  }}
                >
                  {item.cost === 0 ? 'Free' : `${item.cost} 💰`}
                </button>
              )}
              
              {/* Lock Icon */}
              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#666',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  🔒
                </div>
              )}
            </div>
          )
        })}
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
        <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
          Complete missions and games to earn more coins!
        </div>
      </div>
    </div>
  )
}

export default AvatarCustomization