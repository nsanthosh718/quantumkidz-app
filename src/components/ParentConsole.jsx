import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getKids, getMissions, addMission, updateMission, deleteMission, getKidTransactions } from '../utils/storage'
import { getAdvancedAnalytics } from '../utils/aiEngine'
import AppBanner from './AppBanner'

function ParentConsole() {
  const [kids, setKids] = useState([])
  const [missions, setMissions] = useState([])
  const [showAddMission, setShowAddMission] = useState(false)
  const [editingMission, setEditingMission] = useState(null)
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    ageGroup: 'both',
    reward: 5,
    type: 'chore',
    scheduledDate: '',
    weeklyDays: []
  })

  useEffect(() => {
    setKids(getKids())
    setMissions(getMissions())
  }, [])

  const handleAddMission = (e) => {
    e.preventDefault()
    try {
      if (!newMission.title?.trim()) {
        alert('Please enter a mission title')
        return
      }
      if (!newMission.description?.trim()) {
        alert('Please enter a mission description')
        return
      }
      
      if (editingMission) {
        updateMission(editingMission.id, newMission)
        setEditingMission(null)
      } else {
        addMission({ ...newMission, status: 'active' })
      }
      setMissions(getMissions())
      setNewMission({ title: '', description: '', ageGroup: 'both', reward: 5, type: 'chore', scheduledDate: '', weeklyDays: [] })
      setShowAddMission(false)
    } catch (error) {
      console.error('Error adding/updating mission:', error)
      alert('Failed to save mission. Please try again.')
    }
  }

  const handleEditMission = (mission) => {
    setNewMission({
      title: mission.title,
      description: mission.description,
      ageGroup: mission.ageGroup,
      reward: mission.reward,
      type: mission.type,
      scheduledDate: mission.scheduledDate || '',
      weeklyDays: mission.weeklyDays || []
    })
    setEditingMission(mission)
    setShowAddMission(true)
  }

  const handleDeleteMission = (missionId) => {
    try {
      if (!missionId) return
      if (confirm('Delete this mission? This action cannot be undone.')) {
        deleteMission(missionId)
        setMissions(getMissions())
      }
    } catch (error) {
      console.error('Error deleting mission:', error)
      alert('Failed to delete mission. Please try again.')
    }
  }

  return (
    <div>
      <AppBanner />
      <div className="card slide-in">
        <h2 className="text-center mb-4">👨👩👧👦 Parent Console</h2>
        
        <div className="nav">
          <button 
            className="active"
            onClick={() => setShowAddMission(!showAddMission)}
          >
            ➕ Add Mission
          </button>
        </div>
      </div>

      {/* Kids Progress */}
      <div className="card">
        <h3>🤖 AI-Powered Analytics</h3>
        {kids.map(kid => {
          const transactions = getKidTransactions(kid.id)
          const analytics = getAdvancedAnalytics(kid, transactions)
          return (
            <div key={kid.id} style={{ 
              background: '#f0f8ff', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '16px',
              border: '2px solid #e3f2fd'
            }}>
              <h4>{kid.name} ({kid.age} years) - {analytics.financialPersonality.toUpperCase()}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                    {Math.round(analytics.completionRate * 100)}%
                  </div>
                  <div style={{ fontSize: '12px' }}>Success Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
                    {analytics.engagementLevel}
                  </div>
                  <div style={{ fontSize: '12px' }}>Engagement</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                    ${(kid.realMoney || 0).toFixed(0)}
                  </div>
                  <div style={{ fontSize: '12px' }}>Savings</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                🎯 Focus: {analytics.projections.skillDevelopmentAreas.join(', ')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Mission Form */}
      {showAddMission && (
        <div className="card">
          <h3>{editingMission ? '✏️ Edit Mission' : '➕ Create New Mission'}</h3>
          <form onSubmit={handleAddMission}>
            <div style={{ marginBottom: '16px' }}>
              <label>Mission Title:</label>
              <input 
                type="text"
                value={newMission.title}
                onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  marginTop: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label>Description:</label>
              <textarea 
                value={newMission.description}
                onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  marginTop: '4px',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label>Age Group:</label>
                <select 
                  value={newMission.ageGroup}
                  onChange={(e) => setNewMission({...newMission, ageGroup: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                >
                  <option value="both">Both Kids</option>
                  <option value="4+">4+ years</option>
                  <option value="9+">9+ years</option>
                </select>
              </div>
              
              <div>
                <label>Reward (coins):</label>
                <input 
                  type="number"
                  value={newMission.reward}
                  onChange={(e) => setNewMission({...newMission, reward: parseInt(e.target.value)})}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label>Type:</label>
                <select 
                  value={newMission.type}
                  onChange={(e) => setNewMission({...newMission, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                >
                  <option value="chore">🧹 Chore</option>
                  <option value="math">🧮 Math</option>
                  <option value="money">💰 Money</option>
                  <option value="english">📚 English</option>
                  <option value="science">🔬 Science</option>
                  <option value="geography">🌍 Geography</option>
                  <option value="focus">🧘 Focus</option>
                  <option value="kindness">💝 Kindness</option>
                </select>
              </div>
              
              <div>
                <label>Scheduled Date (optional):</label>
                <input 
                  type="date"
                  value={newMission.scheduledDate}
                  onChange={(e) => setNewMission({...newMission, scheduledDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>Weekly Schedule:</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '8px', 
                marginTop: '8px' 
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <label key={day} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '8px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: newMission.weeklyDays.includes(index) ? '#e8f5e8' : 'white',
                    borderColor: newMission.weeklyDays.includes(index) ? '#4CAF50' : '#ddd'
                  }}>
                    <input 
                      type="checkbox"
                      checked={newMission.weeklyDays.includes(index)}
                      onChange={(e) => {
                        const days = [...newMission.weeklyDays]
                        if (e.target.checked) {
                          days.push(index)
                        } else {
                          const dayIndex = days.indexOf(index)
                          if (dayIndex > -1) days.splice(dayIndex, 1)
                        }
                        setNewMission({...newMission, weeklyDays: days})
                      }}
                      style={{ marginBottom: '4px' }}
                    />
                    <span style={{ fontSize: '12px' }}>{day}</span>
                  </label>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Select days when this mission should appear (leave empty for daily)
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingMission ? 'Update Mission' : 'Create Mission'}
            </button>
          </form>
        </div>
      )}

      {/* Current Missions */}
      <div className="card">
        <h3>📋 Current Missions</h3>
        {missions.filter(m => m.status === 'active').map(mission => (
          <div key={mission.id} style={{ 
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '12px',
            position: 'relative'
          }}>
            <h4>{mission.title}</h4>
            <p>{mission.description}</p>
            <div>Age: {mission.ageGroup} | Reward: {mission.reward} coins | Type: {mission.type}</div>
            {mission.scheduledDate && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                📅 Scheduled for: {new Date(mission.scheduledDate).toLocaleDateString()}
              </div>
            )}
            {mission.weeklyDays && mission.weeklyDays.length > 0 && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                🗓️ Weekly: {mission.weeklyDays.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}
              </div>
            )}
            <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
              <button 
                onClick={() => handleEditMission(mission)}
                style={{
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  marginRight: '4px',
                  cursor: 'pointer'
                }}
              >
                ✏️
              </button>
              <button 
                onClick={() => handleDeleteMission(mission.id)}
                style={{
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default ParentConsole