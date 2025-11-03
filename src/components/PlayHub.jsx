import { useState } from 'react'
import { Link } from 'react-router-dom'
import StoryMode from './StoryMode'

function PlayHub({ kid }) {
  const [activeSection, setActiveSection] = useState('games')

  if (!kid) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🎮 Play & Learn</h3>
        <p>Please select a kid profile to continue.</p>
      </div>
    )
  }

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🎮 Play & Learn</h3>
      
      {/* Sub-navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveSection('games')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'games' ? '#2196F3' : '#f0f0f0',
              color: activeSection === 'games' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🎮 Learning Games
          </button>
          <button 
            onClick={() => setActiveSection('story')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'story' ? '#9C27B0' : '#f0f0f0',
              color: activeSection === 'story' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📚 Story Adventures
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'games' && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h4>🎯 Educational Games</h4>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
              Learn math, English, science & geography while having fun!
            </p>
          </div>
          
          <Link to={`/games/${kid?.id || ''}`}>
            <button 
              className="btn btn-primary btn-large" 
              style={{ width: '100%' }}
              disabled={!kid?.id}
            >
              🚀 Start Playing Games
            </button>
          </Link>
          
          <div style={{
            background: '#f0f8ff',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <h4>🎮 Available Games:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>🧮</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Math Challenge</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>📚</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Word Wizard</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>🔬</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Science Explorer</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>🌍</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>World Traveler</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'story' && <StoryMode kid={kid} />}
    </div>
  )
}

export default PlayHub