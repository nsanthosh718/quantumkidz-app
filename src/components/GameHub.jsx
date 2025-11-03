import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getKid } from '../utils/storage'
import { getGamesByAge, canPlayGame, getRemainingPlays } from '../utils/gameEngine'
import AppBanner from './AppBanner'

function GameHub() {
  const { kidId } = useParams()
  const [kid, setKid] = useState(null)
  const [availableGames, setAvailableGames] = useState([])

  useEffect(() => {
    if (kidId) {
      const kidData = getKid(kidId)
      setKid(kidData)
      if (kidData) {
        setAvailableGames(getGamesByAge(kidData.age))
      }
    }
  }, [kidId])

  if (!kid) return <div>Loading...</div>

  return (
    <div>
      <AppBanner />
      <div className="card text-center">
        <h2 className="mb-4">🎮 Learning Games</h2>
      <p>Choose your adventure, {kid.name}!</p>
      
      <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
        <Link to={`/games/math/${kidId}`}>
          <button 
            className="btn btn-primary btn-large"
            style={{ 
              opacity: canPlayGame(kidId, 'math') ? 1 : 0.5,
              position: 'relative'
            }}
          >
            🧮 Math Challenge
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              {canPlayGame(kidId, 'math') 
                ? '1 game left (10 questions)' 
                : 'Come back tomorrow!'
              }
            </div>
          </button>
        </Link>
        
        {availableGames.map(game => (
          <Link key={game.key} to={`/games/${game.key}/${kidId}`}>
            <button 
              className="btn btn-primary btn-large"
              style={{ 
                opacity: canPlayGame(kidId, game.key) ? 1 : 0.5,
                position: 'relative'
              }}
            >
              {game.emoji} {game.name}
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {canPlayGame(kidId, game.key) 
                  ? '1 game left (10 questions)' 
                  : 'Come back tomorrow!'
                }
              </div>
            </button>
          </Link>
        ))}
        
        <Link to={`/games/focus/${kidId}`}>
          <button 
            className="btn btn-secondary btn-large"
            style={{ 
              opacity: canPlayGame(kidId, 'focus') ? 1 : 0.5,
              position: 'relative'
            }}
          >
            🧘 Focus Time
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              {canPlayGame(kidId, 'focus') 
                ? '1 game left' 
                : 'Come back tomorrow!'
              }
            </div>
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
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

export default GameHub