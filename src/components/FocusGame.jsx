import { Link, useParams } from 'react-router-dom'
import AppBanner from './AppBanner'

function FocusGame() {
  const { kidId } = useParams()
  
  return (
    <div>
      <AppBanner />
      <div className="card text-center">
        <h2 className="mb-4">🧘 Focus Time</h2>
        
        <div className="emoji">🚧</div>
        <h3>Coming Soon!</h3>
        <p>This is where focus and mindfulness activities will go.</p>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px', 
          margin: '20px 0',
          textAlign: 'left'
        }}>
          <h4>🔌 Integration Points:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Breathing exercises with visual guides</li>
            <li>Progressive difficulty (30s to 10min)</li>
            <li>Calming sounds and animations</li>
            <li>Focus streak tracking</li>
            <li>Reward integration for completed sessions</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to={`/games/${kidId}`}>
            <button className="btn btn-secondary">
              ← Back to Games
            </button>
          </Link>
          <Link to={`/dashboard/${kidId}`}>
            <button className="btn btn-secondary">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FocusGame