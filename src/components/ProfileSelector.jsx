import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppBanner from './AppBanner'
import { useKids } from '../hooks/useKids'

function ProfileSelector() {
  const { kids, loading, error, createKid, deleteKid } = useKids()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKidName, setNewKidName] = useState('')
  const [newKidAge, setNewKidAge] = useState('')
  const [newKidGender, setNewKidGender] = useState('boy')

  const handleAddKid = async (e) => {
    e.preventDefault()
    try {
      await createKid({
        name: newKidName,
        age: parseInt(newKidAge),
        gender: newKidGender
      })
      
      setNewKidName('')
      setNewKidAge('')
      setNewKidGender('boy')
      setShowAddForm(false)
    } catch (error) {
      // Error already handled by service layer
    }
  }

  const handleDeleteKid = async (kidId) => {
    if (confirm('Delete this kid profile? This action cannot be undone.')) {
      try {
        await deleteKid(kidId)
      } catch (error) {
        // Error already handled by service layer
      }
    }
  }

  return (
    <div>
      <AppBanner />
      <div className="card text-center slide-in">
        <h1 className="mb-4">👋 Who's Playing Today?</h1>
      
      {loading && (
        <p style={{ color: '#666', marginBottom: '20px' }}>Loading profiles...</p>
      )}
      
      {!loading && kids.length === 0 && (
        <p style={{ color: '#666', marginBottom: '20px' }}>No kids added yet. Create your first profile!</p>
      )}
      
      {error && (
        <p style={{ color: '#f44336', marginBottom: '20px' }}>Error: {error}</p>
      )}
      
      {kids.map(kid => (
        <div key={kid.id} style={{ position: 'relative', marginBottom: '12px' }}>
          <Link to={`/dashboard/${kid.id}`}>
            <button className="btn btn-primary btn-large">
              <div className="emoji">{kid.gender === 'girl' ? (kid.age >= 9 ? '👧' : '👶') : (kid.age >= 9 ? '👦' : '👶')}</div>
              <div>{kid.name} ({kid.age} years old)</div>
              <div>💰 {kid.coins} coins</div>
            </button>
          </Link>
          <button 
            onClick={() => handleDeleteKid(kid.id)}
            className="delete-btn"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      ))}
      
      <button 
        className="btn btn-secondary btn-animate"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        ➕ Add New Kid
      </button>
      
      {showAddForm && (
        <form onSubmit={handleAddKid} className="form-slide" style={{ marginTop: '16px', textAlign: 'left' }}>
          <input 
            type="text"
            placeholder="Kid's name"
            value={newKidName}
            onChange={(e) => setNewKidName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          />
          <input 
            type="number"
            placeholder="Age"
            value={newKidAge}
            onChange={(e) => setNewKidAge(e.target.value)}
            min="3"
            max="18"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          />
          <select 
            value={newKidGender}
            onChange={(e) => setNewKidGender(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          >
            <option value="boy">👦 Boy</option>
            <option value="girl">👧 Girl</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Create Kid Profile
          </button>
        </form>
      )}
      
      <Link to="/parent">
        <button className="btn btn-secondary">
          👨👩👧👦 Parent Console
        </button>
      </Link>
      </div>
    </div>
  )
}

export default ProfileSelector