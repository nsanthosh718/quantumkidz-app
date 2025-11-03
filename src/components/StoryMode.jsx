import { useState, useEffect } from 'react'
import { getAvailableChapters, getCurrentScene, saveProgress, completeChapter, STORY_CHAPTERS } from '../utils/storySystem'
import { updateKid } from '../utils/storage'
import { updateAvatarMood, feedPet } from '../utils/avatarSystem'

function StoryMode({ kid }) {
  const [chapters, setChapters] = useState([])
  const [currentScene, setCurrentScene] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showReward, setShowReward] = useState(null)

  useEffect(() => {
    if (kid) {
      const availableChapters = getAvailableChapters(kid.id, kid.coins)
      const scene = getCurrentScene(kid.id)
      
      setChapters(availableChapters)
      setCurrentScene(scene)
      setIsPlaying(!!scene)
    }
  }, [kid])

  const startChapter = (chapterId) => {
    const chapter = STORY_CHAPTERS[chapterId]
    const firstScene = chapter.scenes[0]
    
    saveProgress(kid.id, chapterId, firstScene.id)
    setCurrentScene({ ...firstScene, chapterId })
    setIsPlaying(true)
  }

  const makeChoice = (choice) => {
    if (choice.coins > 0) {
      // Award coins
      const updatedKid = { ...kid, coins: kid.coins + choice.coins }
      updateKid(updatedKid)
      
      // Show reward
      setShowReward(choice.coins)
      setTimeout(() => setShowReward(null), 2000)
      
      // Update avatar mood and feed pet
      updateAvatarMood(kid.id, 'good_performance')
      feedPet(kid.id, 1)
    }

    if (choice.next === 'complete') {
      // Complete chapter
      completeChapter(kid.id, currentScene.chapterId)
      setIsPlaying(false)
      setCurrentScene(null)
      
      // Refresh chapters
      const availableChapters = getAvailableChapters(kid.id, kid.coins + choice.coins)
      setChapters(availableChapters)
      
      updateAvatarMood(kid.id, 'achievement_unlock')
    } else {
      // Go to next scene
      const chapter = STORY_CHAPTERS[currentScene.chapterId]
      const nextScene = chapter.scenes.find(s => s.id === choice.next)
      
      if (nextScene) {
        saveProgress(kid.id, currentScene.chapterId, nextScene.id)
        setCurrentScene({ ...nextScene, chapterId: currentScene.chapterId })
      }
    }
  }

  const exitStory = () => {
    setIsPlaying(false)
    setCurrentScene(null)
    saveProgress(kid.id, null, null)
  }

  if (isPlaying && currentScene) {
    return (
      <div className="card slide-in">
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3>📖 Story Adventure</h3>
          <button 
            onClick={exitStory}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Scene Display */}
        <div style={{
          background: '#f0f8ff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          position: 'relative',
          minHeight: '200px'
        }}>
          {/* Background */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontSize: '48px',
            opacity: 0.3
          }}>
            {currentScene.background}
          </div>
          
          {/* Character */}
          <div style={{
            fontSize: '64px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            {currentScene.character}
          </div>
          
          {/* Scene Title */}
          <h4 style={{ 
            textAlign: 'center',
            marginBottom: '16px',
            color: '#2196F3'
          }}>
            {currentScene.title}
          </h4>
          
          {/* Scene Text */}
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            textAlign: 'center',
            color: '#333',
            marginBottom: '24px'
          }}>
            {currentScene.text}
          </p>
        </div>

        {/* Choices */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {currentScene.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => makeChoice(choice)}
              style={{
                padding: '16px',
                border: '2px solid #2196F3',
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e3f2fd'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <span>{choice.text}</span>
              {choice.coins > 0 && (
                <span style={{ 
                  background: '#4CAF50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  +{choice.coins} 💰
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reward Notification */}
        {showReward && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#4CAF50',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 1000,
            animation: 'bounce 0.6s ease-in-out'
          }}>
            +{showReward} Coins! 🎉
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card slide-in">
      <h3 className="mb-4">📖 Story Adventures</h3>
      
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h4>🌟 Interactive Financial Adventures</h4>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Learn money skills through exciting stories and choices!
        </p>
      </div>

      {/* Chapter Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {chapters.map(chapter => (
          <div key={chapter.id} style={{
            background: chapter.isUnlocked ? 'white' : '#f5f5f5',
            border: `2px solid ${chapter.isCompleted ? '#4CAF50' : chapter.isUnlocked ? '#2196F3' : '#ddd'}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            opacity: chapter.isUnlocked ? 1 : 0.6,
            position: 'relative'
          }}>
            {/* Chapter Status */}
            {chapter.isCompleted && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
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
            
            {!chapter.isUnlocked && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#666',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                🔒
              </div>
            )}
            
            {/* Chapter Icon */}
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {chapter.emoji}
            </div>
            
            {/* Chapter Info */}
            <h4 style={{ marginBottom: '8px' }}>{chapter.title}</h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              minHeight: '40px'
            }}>
              {chapter.description}
            </p>
            
            {/* Unlock Requirements */}
            {!chapter.isUnlocked && chapter.unlockRequirement && (
              <div style={{
                background: '#fff3e0',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666',
                marginBottom: '16px'
              }}>
                Requires: Complete previous chapter + {chapter.unlockRequirement.coins} coins
              </div>
            )}
            
            {/* Action Button */}
            <button
              onClick={() => chapter.isUnlocked && startChapter(chapter.id)}
              disabled={!chapter.isUnlocked}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: chapter.isCompleted ? '#4CAF50' : chapter.isUnlocked ? '#2196F3' : '#ccc',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: chapter.isUnlocked ? 'pointer' : 'not-allowed'
              }}
            >
              {chapter.isCompleted ? '✓ Completed' : chapter.isUnlocked ? '▶ Start Adventure' : '🔒 Locked'}
            </button>
          </div>
        ))}
      </div>

      {chapters.filter(c => c.isCompleted).length > 0 && (
        <div style={{
          background: '#e8f5e8',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#4CAF50' }}>🏆 Adventure Progress</h4>
          <p>
            You've completed {chapters.filter(c => c.isCompleted).length} out of {chapters.length} adventures!
          </p>
        </div>
      )}
    </div>
  )
}

export default StoryMode