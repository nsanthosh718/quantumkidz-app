// Weekly Challenge System for QuantumKidz

export const getWeekInfo = () => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  endOfWeek.setHours(23, 59, 59, 999)
  
  const weekId = `week_${startOfWeek.getFullYear()}_${startOfWeek.getMonth()}_${startOfWeek.getDate()}`
  
  return {
    weekId,
    startOfWeek,
    endOfWeek,
    weekNumber: getWeekNumber(now),
    daysLeft: Math.ceil((endOfWeek - now) / (1000 * 60 * 60 * 24))
  }
}

const getWeekNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))
}

export const getWeeklyChallenges = () => {
  const challenges = [
    {
      id: 'math_master',
      title: 'Math Master Challenge',
      description: 'Complete 5 math games this week',
      target: 5,
      reward: 50,
      emoji: '🧮'
    },
    {
      id: 'mission_hero',
      title: 'Mission Hero',
      description: 'Complete 10 missions this week',
      target: 10,
      reward: 75,
      emoji: '🎯'
    },
    {
      id: 'streak_keeper',
      title: 'Streak Keeper',
      description: 'Login 7 days in a row',
      target: 7,
      reward: 100,
      emoji: '🔥'
    },
    {
      id: 'coin_collector',
      title: 'Coin Collector',
      description: 'Earn 200 coins this week',
      target: 200,
      reward: 25,
      emoji: '💰'
    }
  ]
  
  return challenges
}

export const getWeeklyProgress = (kidId) => {
  const { weekId } = getWeekInfo()
  const key = `weekly_progress_${kidId}_${weekId}`
  return JSON.parse(localStorage.getItem(key) || '{}')
}

export const updateWeeklyProgress = (kidId, challengeId, increment = 1) => {
  const { weekId } = getWeekInfo()
  const key = `weekly_progress_${kidId}_${weekId}`
  const progress = getWeeklyProgress(kidId)
  
  progress[challengeId] = (progress[challengeId] || 0) + increment
  localStorage.setItem(key, JSON.stringify(progress))
  
  return progress
}

export const getWeeklyLeaderboard = () => {
  const { weekId } = getWeekInfo()
  const key = `weekly_leaderboard_${weekId}`
  return JSON.parse(localStorage.getItem(key) || '[]')
}

export const updateLeaderboard = (kidId, kidName, points) => {
  const { weekId } = getWeekInfo()
  const key = `weekly_leaderboard_${weekId}`
  const leaderboard = getWeeklyLeaderboard()
  
  const existingEntry = leaderboard.find(entry => entry.kidId === kidId)
  if (existingEntry) {
    existingEntry.points += points
  } else {
    leaderboard.push({ kidId, kidName, points })
  }
  
  leaderboard.sort((a, b) => b.points - a.points)
  localStorage.setItem(key, JSON.stringify(leaderboard.slice(0, 10))) // Top 10
  
  return leaderboard
}

export const checkCompletedChallenges = (kidId) => {
  const challenges = getWeeklyChallenges()
  const progress = getWeeklyProgress(kidId)
  const completed = []
  
  challenges.forEach(challenge => {
    const current = progress[challenge.id] || 0
    if (current >= challenge.target) {
      completed.push(challenge)
    }
  })
  
  return completed
}