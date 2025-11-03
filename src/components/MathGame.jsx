import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getKid, updateKid } from '../utils/storage'
import { generateMathProblem, getMathLevel, recordMathResult, getMathStats } from '../utils/mathEngine'
import { canPlayGame, recordGamePlay, getRemainingPlays } from '../utils/gameEngine'
import { updateWeeklyProgress, updateLeaderboard } from '../utils/weeklyChallenge'
import { checkAchievements } from '../utils/achievementSystem'
import { updateAvatarMood, feedPet } from '../utils/avatarSystem'
import { updateStreak, checkStreakReward, calculateStreakBonus } from '../utils/streakSystem'
import { errorHandler, withErrorHandling } from '../utils/errorHandler'
import AppBanner from './AppBanner'

function MathGame() {
  const { kidId } = useParams()
  const [kid, setKid] = useState(null)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [gameState, setGameState] = useState('menu') // menu, playing, result
  const [score, setScore] = useState(0)
  const [problemCount, setProblemCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    try {
      if (kidId) {
        const kidData = getKid(kidId)
        if (kidData) {
          setKid(kidData)
          setStats(getMathStats(kidId))
        } else {
          console.error('Kid not found')
        }
      }
    } catch (error) {
      console.error('Error loading kid data:', error)
    }
  }, [kidId])

  const startGame = withErrorHandling(() => {
    if (!kidId || !kid) {
      alert('Please select a valid profile to play.')
      return
    }
    
    if (!canPlayGame(kidId, 'math')) {
      alert('You\'ve reached your daily limit for Math Challenge! Try again tomorrow.')
      return
    }
    
    recordGamePlay(kidId, 'math')
    setGameState('playing')
    setScore(0)
    setProblemCount(0)
    setStartTime(Date.now())
    generateNewProblem()
  }, 'MathGame.startGame')

  const generateNewProblem = () => {
    try {
      if (!kid) {
        throw new Error('No kid data available')
      }
      
      const level = getMathLevel(kid)
      const problem = generateMathProblem(level)
      
      if (!problem) {
        throw new Error('Failed to generate math problem')
      }
      
      setCurrentProblem(problem)
      setUserAnswer('')
      setStartTime(Date.now())
      setFeedback('')
    } catch (error) {
      console.error('Error generating problem:', error)
      setFeedback('Error generating problem. Please try again.')
    }
  }

  const submitAnswer = withErrorHandling(() => {
    if (!kid || !currentProblem || !startTime) {
      setFeedback('Error: Game state is invalid. Please restart.')
      return
    }
    
    const answer = parseInt(userAnswer)
    if (isNaN(answer)) {
      setFeedback('Please enter a valid number.')
      return
    }

    const timeSpent = Date.now() - startTime
    const result = recordMathResult(kid.id, currentProblem, answer, timeSpent)
    
    if (result && result.correct) {
      setScore(score + 1)
      setFeedback('✅ Correct! Great job!')
      // Award coins for correct answers
      const updatedKid = { ...kid, coins: (kid.coins || 0) + 2 }
      updateKid(updatedKid)
      setKid(updatedKid)
    } else {
      setFeedback(`❌ Not quite. The answer is ${currentProblem.answer || 'unknown'}`)
    }

    setProblemCount(problemCount + 1)
    setGameState('result')
    
    setTimeout(() => {
      if (problemCount < 9) {
        generateNewProblem()
        setGameState('playing')
      } else {
        endGame()
      }
    }, 2000)
  }, 'MathGame.submitAnswer')

  const endGame = () => {
    // Update weekly challenge progress
    updateWeeklyProgress(kid.id, 'math_master')
    updateLeaderboard(kid.id, kid.name, score * 5) // 5 points per correct answer
    
    // Check for achievements
    const gameStats = {
      perfectGames: score === 10 ? 1 : 0,
      gamesPlayed: ['math'],
      totalCoins: kid.coins || 0
    }
    checkAchievements(kid.id, gameStats)
    
    // Update avatar mood and feed pet
    updateAvatarMood(kid.id, 'good_performance')
    feedPet(kid.id, score)
    
    // Update game streak
    const gameStreak = updateStreak(kid.id, 'game', true)
    const perfectStreak = updateStreak(kid.id, 'perfect', score === 10)
    
    // Check for streak rewards
    const gameReward = checkStreakReward(kid.id, 'game', gameStreak.current)
    const perfectReward = checkStreakReward(kid.id, 'perfect', perfectStreak.current)
    
    if (gameReward || perfectReward) {
      let bonusCoins = 0
      if (gameReward) bonusCoins += gameReward.coins + calculateStreakBonus(kid.id, 'game', gameReward.coins)
      if (perfectReward) bonusCoins += perfectReward.coins + calculateStreakBonus(kid.id, 'perfect', perfectReward.coins)
      
      const updatedKid = { ...kid, coins: kid.coins + bonusCoins }
      updateKid(updatedKid)
      
      if (bonusCoins > 0) {
        alert(`🔥 Streak bonus! +${bonusCoins} coins!`)
      }
    }
    
    setGameState('menu')
    setStats(getMathStats(kid.id))
  }

  if (!kidId) {
    return (
      <div>
        <AppBanner />
        <div className="card text-center">
          <h2 className="mb-4">🧮 AI Math Challenge</h2>
          <p>Invalid kid ID. Please go back and select a valid profile.</p>
          <Link to="/">
            <button className="btn btn-primary">← Back to Home</button>
          </Link>
        </div>
      </div>
    )
  }
  
  if (!kid) return <div>Loading...</div>

  return (
    <div>
      <AppBanner />
      <div className="card text-center">
        <h2 className="mb-4">🧮 AI Math Challenge</h2>
      
      {gameState === 'menu' && (
        <div>
          <div className="emoji">🤖</div>
          <h3>Ready for Smart Math?</h3>
          <p>AI adapts to your skill level!</p>
          
          {stats && (
            <div style={{ 
              background: '#f0f8ff', 
              padding: '16px', 
              borderRadius: '12px', 
              margin: '16px 0'
            }}>
              <h4>📈 Your Stats</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                    {stats.accuracy}%
                  </div>
                  <div style={{ fontSize: '12px' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                    {stats.streak}
                  </div>
                  <div style={{ fontSize: '12px' }}>Streak</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                {stats.totalProblems} problems solved | Avg: {stats.avgTime}s
              </div>
            </div>
          )}
          
          <div style={{ 
            background: canPlayGame(kidId, 'math') ? '#e8f5e8' : '#ffebee', 
            padding: '12px', 
            borderRadius: '8px', 
            margin: '16px 0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {canPlayGame(kidId, 'math') 
                ? '1 game available today (10 questions)' 
                : 'Daily limit reached! Come back tomorrow 🌅'
              }
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-large" 
            onClick={startGame}
            disabled={!canPlayGame(kidId, 'math')}
            style={{ opacity: canPlayGame(kidId, 'math') ? 1 : 0.5 }}
          >
            🚀 Start Challenge
          </button>
        </div>
      )}

      {gameState === 'playing' && currentProblem && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Problem {problemCount + 1}/10</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Score: {score}/{problemCount}</div>
          </div>
          
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '20px 0',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px'
          }}>
            {currentProblem.question}
          </div>
          
          <input 
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
            placeholder="Your answer"
            style={{
              fontSize: '24px',
              padding: '16px',
              border: '3px solid #ddd',
              borderRadius: '12px',
              textAlign: 'center',
              width: '200px',
              marginBottom: '20px'
            }}
            autoFocus
          />
          
          <div>
            <button 
              className="btn btn-primary btn-large"
              onClick={submitAnswer}
              disabled={!userAnswer}
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: feedback.includes('✅') ? '#4CAF50' : '#f44336',
            margin: '20px 0'
          }}>
            {feedback}
          </div>
          
          {feedback.includes('✅') && (
            <div style={{ fontSize: '16px', color: '#4CAF50' }}>
              +2 coins earned! 💰
            </div>
          )}
        </div>
      )}


      </div>
    </div>
  )
}

export default MathGame