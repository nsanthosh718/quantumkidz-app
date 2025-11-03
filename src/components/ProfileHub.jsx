import { useState } from 'react'
import AvatarCustomization from './AvatarCustomization'
import AIInsights from './AIInsights'

function ProfileHub({ kid }) {
  const [activeSection, setActiveSection] = useState('avatar')

  return (
    <div className="card slide-in">
      <h3 className="mb-4">👤 My Profile</h3>
      
      {/* Sub-navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveSection('avatar')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'avatar' ? '#2196F3' : '#f0f0f0',
              color: activeSection === 'avatar' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🎨 Customize Avatar
          </button>
          <button 
            onClick={() => setActiveSection('insights')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'insights' ? '#4CAF50' : '#f0f0f0',
              color: activeSection === 'insights' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🤖 AI Coach
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'avatar' && <AvatarCustomization kid={kid} />}
      {activeSection === 'insights' && <AIInsights kid={kid} />}
    </div>
  )
}

export default ProfileHub