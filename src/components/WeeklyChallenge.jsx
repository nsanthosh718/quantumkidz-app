import { useState, useEffect } from 'react'
import { getWeekInfo, getWeeklyChallenges, getWeeklyProgress, getWeeklyLeaderboard, checkCompletedChallenges } from '../utils/weeklyChallenge'

function WeeklyChallenge({ kid }) {
  const [weekInfo, setWeekInfo] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [progress, setProgress] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])

  useEffect(() => {
    if (kid) {
      const info = getWeekInfo()
      const challengeList = getWeeklyChallenges()
      const userProgress = getWeeklyProgress(kid.id)
      const board = getWeeklyLeaderboard()
      const completed = checkCompletedChallenges(kid.id)
      
      setWeekInfo(info)
      setChallenges(challengeList)
      setProgress(userProgress)
      setLeaderboard(board)
      setCompletedChallenges(completed)
    }
  }, [kid])

  if (!weekInfo) return <div>Loading...</div>

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🏆 Weekly Tournament</h3>
      
      {/* Week Info */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '16px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h4>Week {weekInfo.weekNumber} Challenge</h4>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {weekInfo.daysLeft} days left • Ends Sunday
        </div>
      </div>

      {/* Challenges */}
      <div style={{ marginBottom: '24px' }}>
        <h4>🎯 This Week's Challenges</h4>
        {challenges.map(challenge => {
          const current = progress[challenge.id] || 0
          const isCompleted = current >= challenge.target
          const percentage = Math.min((current / challenge.target) * 100, 100)
          
          return (
            <div key={challenge.id} style={{
              background: isCompleted ? '#e8f5e8' : '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: isCompleted ? '2px solid #4CAF50' : '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>{challenge.emoji}</span>
                  <strong>{challenge.title}</strong>
                  {isCompleted && <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✅</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{current}/{challenge.target}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>+{challenge.reward} coins</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {challenge.description}
              </div>
              
              {/* Progress Bar */}
              <div style={{ 
                background: '#e0e0e0', 
                borderRadius: '10px', 
                height: '8px', 
                marginTop: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: isCompleted ? '#4CAF50' : '#2196F3',
                  width: `${percentage}%`,
                  height: '100%',
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Leaderboard */}
      <div>
        <h4>🏅 Weekly Leaderboard</h4>
        {leaderboard.length > 0 ? (
          <div>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div key={entry.kidId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: entry.kidId === kid.id ? '#fff3e0' : '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px',
                border: entry.kidId === kid.id ? '2px solid #FF9800' : '1px solid #ddd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '18px', 
                    marginRight: '12px',
                    fontWeight: 'bold'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span style={{ fontWeight: entry.kidId === kid.id ? 'bold' : 'normal' }}>
                    {entry.kidName}
                    {entry.kidId === kid.id && ' (You)'}
                  </span>
                </div>
                <div style={{ fontWeight: 'bold', color: '#FF9800' }}>
                  {entry.points} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No participants yet. Be the first to join!
          </div>
        )}
      </div>

      {/* Completed Challenges Celebration */}
      {completedChallenges.length > 0 && (
        <div style={{
          background: '#e8f5e8',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '20px',
          textAlign: 'center',
          border: '2px solid #4CAF50'
        }}>
          <h4 style={{ color: '#4CAF50' }}>🎉 Congratulations!</h4>
          <p>You've completed {completedChallenges.length} challenge{completedChallenges.length > 1 ? 's' : ''} this week!</p>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Total bonus: +{completedChallenges.reduce((sum, c) => sum + c.reward, 0)} coins
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklyChallenge