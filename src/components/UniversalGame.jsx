import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getKid, updateKid } from '../utils/storage'
import { generateMoneyQuestion, generateEnglishQuestion, generateScienceQuestion, generateGeographyQuestion, recordGameResult, getGameStats, canPlayGame, recordGamePlay, getRemainingPlays } from '../utils/gameEngine'
import { updateWeeklyProgress, updateLeaderboard } from '../utils/weeklyChallenge'
import { checkAchievements } from '../utils/achievementSystem'
import { updateAvatarMood, feedPet } from '../utils/avatarSystem'
import { updateStreak, checkStreakReward, calculateStreakBonus } from '../utils/streakSystem'
import AppBanner from './AppBanner'

function UniversalGame() {
  const { gameType, kidId } = useParams()
  const [kid, setKid] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [gameState, setGameState] = useState('menu')
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [stats, setStats] = useState(null)

  const gameInfo = {
    money: { title: 'Money Master', emoji: '💰', color: '#4CAF50' },
    english: { title: 'Word Wizard', emoji: '📚', color: '#2196F3' },
    science: { title: 'Science Explorer', emoji: '🔬', color: '#FF9800' },
    geography: { title: 'World Traveler', emoji: '🌍', color: '#9C27B0' }
  }

  const generators = {
    money: generateMoneyQuestion,
    english: generateEnglishQuestion,
    science: generateScienceQuestion,
    geography: generateGeographyQuestion
  }

  useEffect(() => {
    if (kidId && gameType) {
      const kidData = getKid(kidId)
      setKid(kidData)
      setStats(getGameStats(kidId, gameType))
    }
  }, [kidId, gameType])

  const startGame = () => {
    if (!canPlayGame(kidId, gameType)) {
      alert(`You've reached your daily limit for ${gameInfo[gameType].title}! Try again tomorrow.`)
      return
    }
    recordGamePlay(kidId, gameType)
    setGameState('playing')
    setScore(0)
    setQuestionCount(0)
    generateNewQuestion()
  }

  const generateNewQuestion = () => {
    const generator = generators[gameType]
    if (generator) {
      const question = generator(kid.age)
      setCurrentQuestion(question)
      setSelectedAnswer('')
      setStartTime(Date.now())
      setFeedback('')
    }
  }

  const submitAnswer = () => {
    if (!selectedAnswer) return

    const timeSpent = Date.now() - startTime
    const correct = selectedAnswer === currentQuestion.answer
    
    recordGameResult(kid.id, gameType, currentQuestion, selectedAnswer, correct, timeSpent)
    
    if (correct) {
      setScore(score + 1)
      setFeedback('✅ Excellent! Well done!')
      const updatedKid = { ...kid, coins: kid.coins + 3 }
      updateKid(updatedKid)
      setKid(updatedKid)
    } else {
      setFeedback(`❌ Not quite. The answer is: ${currentQuestion.answer}`)
    }

    setQuestionCount(questionCount + 1)
    setGameState('result')
    
    setTimeout(() => {
      if (questionCount < 9) {
        generateNewQuestion()
        setGameState('playing')
      } else {
        endGame()
      }
    }, 2500)
  }

  const endGame = () => {
    // Update weekly challenge progress
    updateWeeklyProgress(kid.id, 'math_master')
    updateLeaderboard(kid.id, kid.name, score * 5) // 5 points per correct answer
    
    // Check for achievements
    const gameStats = {
      perfectGames: score === 10 ? 1 : 0,
      gamesPlayed: [gameType],
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
    setStats(getGameStats(kid.id, gameType))
  }

  if (!kid || !gameInfo[gameType]) return <div>Loading...</div>

  const game = gameInfo[gameType]

  return (
    <div>
      <AppBanner />
      <div className="card text-center">
        <h2 className="mb-4" style={{ color: game.color }}>
        {game.emoji} {game.title}
      </h2>
      
      {gameState === 'menu' && (
        <div>
          <div className="emoji">🎯</div>
          <h3>Ready to Learn?</h3>
          <p>Test your knowledge and earn coins!</p>
          
          {stats && stats.totalQuestions > 0 && (
            <div style={{ 
              background: '#f0f8ff', 
              padding: '16px', 
              borderRadius: '12px', 
              margin: '16px 0'
            }}>
              <h4>📊 Your Progress</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: game.color }}>
                    {stats.accuracy}%
                  </div>
                  <div style={{ fontSize: '12px' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                    {stats.streak}
                  </div>
                  <div style={{ fontSize: '12px' }}>Streak</div>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ 
            background: canPlayGame(kidId, gameType) ? '#e8f5e8' : '#ffebee', 
            padding: '12px', 
            borderRadius: '8px', 
            margin: '16px 0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {canPlayGame(kidId, gameType) 
                ? '1 game available today (10 questions)' 
                : 'Daily limit reached! Come back tomorrow 🌅'
              }
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-large" 
            onClick={startGame}
            disabled={!canPlayGame(kidId, gameType)}
            style={{ opacity: canPlayGame(kidId, gameType) ? 1 : 0.5 }}
          >
            🚀 Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Question {questionCount + 1}/10</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Score: {score}/{questionCount}</div>
          </div>
          
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: '20px 0',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px'
          }}>
            {currentQuestion.question}
          </div>
          
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                style={{
                  padding: '16px',
                  border: `3px solid ${selectedAnswer === option ? game.color : '#ddd'}`,
                  borderRadius: '12px',
                  background: selectedAnswer === option ? `${game.color}20` : 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          <button 
            className="btn btn-primary btn-large"
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            style={{ backgroundColor: game.color }}
          >
            Submit Answer
          </button>
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
              +3 coins earned! 💰
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
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

export default UniversalGame