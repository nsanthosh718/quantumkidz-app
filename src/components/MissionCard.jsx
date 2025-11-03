import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { errorHandler, AppError } from '../utils/errorHandler'

function MissionCard({ mission, isCompleted, onComplete, onUncomplete, kidAge, completionNotes }) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const { kidId } = useParams()
  const navigate = useNavigate()
  
  const getEmoji = (type) => {
    const emojis = {
      chore: '🧹',
      math: '🧮',
      money: '💰',
      english: '📚',
      science: '🔬',
      geography: '🌍',
      focus: '🧘',
      kindness: '💝'
    }
    return emojis[type] || '⭐'
  }

  const buttonSize = kidAge <= 4 ? 'btn-large' : ''
  
  const handleComplete = () => {
    try {
      if (!notes.trim()) {
        alert('Please add notes about what you did to complete this mission!')
        setShowNotes(true)
        return
      }
      onComplete(notes.trim())
      setNotes('')
      setShowNotes(false)
    } catch (error) {
      errorHandler.handle(error, 'MissionCard.handleComplete')
    }
  }
  
  const canComplete = notes.trim().length > 0

  return (
    <div>
      <div className={`mission-card ${isCompleted ? 'completed' : ''}`}>
        <div className="emoji">{getEmoji(mission.type)}</div>
        <h4>{mission.title}</h4>
        <p>{mission.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span>💰 {mission.reward} coins</span>
          {!isCompleted ? (
            <div>
              <button 
                className={`btn btn-secondary ${buttonSize}`}
                onClick={() => setShowNotes(!showNotes)}
                style={{ width: 'auto', margin: 0, padding: kidAge <= 4 ? '12px 16px' : '6px 12px', marginRight: '8px' }}
              >
                📝 Notes
              </button>
              {['math', 'money', 'english', 'science', 'geography'].includes(mission.type) && (
                <button 
                  className={`btn ${buttonSize}`}
                  onClick={() => navigate(`/games/${mission.type}/${kidId}`)}
                  style={{ 
                    width: 'auto', 
                    margin: 0, 
                    padding: kidAge <= 4 ? '12px 16px' : '6px 12px',
                    marginRight: '8px',
                    background: '#FF9800',
                    color: 'white'
                  }}
                >
                  🎮 Play
                </button>
              )}
              <button 
                className={`btn btn-primary ${buttonSize}`}
                onClick={handleComplete}
                disabled={!canComplete}
                style={{ 
                  width: 'auto', 
                  margin: 0, 
                  padding: kidAge <= 4 ? '16px 24px' : '8px 16px',
                  opacity: canComplete ? 1 : 0.5,
                  cursor: canComplete ? 'pointer' : 'not-allowed'
                }}
              >
                {kidAge <= 4 ? '✅ Done!' : 'Complete'}
              </button>
            </div>
          ) : (
            <div>
              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✅ Done!</span>
              {completionNotes && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowNotes(!showNotes)}
                  style={{ 
                    width: 'auto', 
                    margin: 0, 
                    padding: '4px 8px', 
                    marginLeft: '8px',
                    fontSize: '12px'
                  }}
                >
                  📝 View Notes
                </button>
              )}
              <button 
                className="btn"
                onClick={onUncomplete}
                style={{ 
                  width: 'auto', 
                  margin: 0, 
                  padding: '4px 8px', 
                  marginLeft: '8px',
                  fontSize: '12px',
                  background: '#ff9800',
                  color: 'white'
                }}
              >
                ↩️ Redo
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showNotes && (
        isCompleted && completionNotes ? (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: '#e8f5e8', 
            borderRadius: '8px',
            border: '2px solid #c8e6c9'
          }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2e7d32' }}>
              📝 What you did:
            </label>
            <div style={{
              padding: '8px',
              background: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              border: '1px solid #c8e6c9'
            }}>
              {completionNotes}
            </div>
          </div>
        ) : !isCompleted && (
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          background: '#f0f8ff', 
          borderRadius: '8px',
          border: '2px solid #e3f2fd'
        }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            📝 What did you do?
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us about your work..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              minHeight: '60px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#d32f2f', fontWeight: 'bold' }}>
            Required: Explain how you completed this mission
          </div>
        </div>
        )
      )}
    </div>
  )
}

export default MissionCard