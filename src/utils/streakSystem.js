// Streak Tracking & Rewards System

export const STREAK_TYPES = {
  login: { name: 'Daily Login', emoji: '🔥', multiplier: 1 },
  mission: { name: 'Mission Streak', emoji: '🎯', multiplier: 2 },
  game: { name: 'Game Streak', emoji: '🎮', multiplier: 1.5 },
  perfect: { name: 'Perfect Score', emoji: '⭐', multiplier: 3 }
}

export const STREAK_REWARDS = {
  3: { coins: 10, title: 'Getting Hot!', emoji: '🔥' },
  7: { coins: 25, title: 'On Fire!', emoji: '🔥🔥' },
  14: { coins: 50, title: 'Blazing!', emoji: '🔥🔥🔥' },
  30: { coins: 100, title: 'Legendary!', emoji: '👑' },
  50: { coins: 200, title: 'Unstoppable!', emoji: '🌟' },
  100: { coins: 500, title: 'Master Streaker!', emoji: '💎' }
}

export const STREAK_SAVERS = {
  freeze: { name: 'Streak Freeze', cost: 50, description: 'Protect your streak for 1 day' },
  double: { name: 'Double Coins', cost: 30, description: 'Double coins for next activity' },
  boost: { name: 'Streak Boost', cost: 75, description: 'Add +1 to current streak' }
}

export const getStreakData = (kidId, streakType) => {
  try {
    if (!kidId || !streakType) {
      throw new Error('Kid ID and streak type are required')
    }
    
    const key = `streak_${streakType}_${kidId}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : {
      current: 0,
      best: 0,
      lastDate: null,
      freezeUsed: false,
      multiplierActive: false
    }
  } catch (error) {
    console.error('Error getting streak data:', error)
    return {
      current: 0,
      best: 0,
      lastDate: null,
      freezeUsed: false,
      multiplierActive: false
    }
  }
}

export const updateStreak = (kidId, streakType, success = true) => {
  try {
    if (!kidId || !streakType) {
      throw new Error('Kid ID and streak type are required')
    }
    
    const today = new Date().toDateString()
    const streakData = getStreakData(kidId, streakType)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    let newStreak = { ...streakData }
    
    if (streakData.lastDate === today) {
      // Already updated today, no change
      return newStreak
    }
    
    if (success) {
      if (streakData.lastDate === yesterdayStr || streakData.current === 0) {
        // Continue streak or start new one
        newStreak.current += 1
        newStreak.best = Math.max(newStreak.best, newStreak.current)
      } else if (streakData.freezeUsed) {
        // Use freeze to maintain streak
        newStreak.current += 1
        newStreak.freezeUsed = false
      } else {
        // Streak broken, start over
        newStreak.current = 1
      }
    } else {
      // Failed activity
      if (!streakData.freezeUsed) {
        newStreak.current = 0
      } else {
        newStreak.freezeUsed = false
      }
    }
    
    newStreak.lastDate = today
    
    const key = `streak_${streakType}_${kidId}`
    localStorage.setItem(key, JSON.stringify(newStreak))
    
    return newStreak
  } catch (error) {
    console.error('Error updating streak:', error)
    return getStreakData(kidId, streakType)
  }
}

export const checkStreakReward = (kidId, streakType, currentStreak) => {
  const rewardKey = `streak_reward_${streakType}_${kidId}_${currentStreak}`
  const alreadyRewarded = localStorage.getItem(rewardKey)
  
  if (!alreadyRewarded && STREAK_REWARDS[currentStreak]) {
    localStorage.setItem(rewardKey, 'true')
    return STREAK_REWARDS[currentStreak]
  }
  
  return null
}

export const useStreakSaver = (kidId, streakType, saverType) => {
  try {
    if (!kidId || !streakType || !saverType) {
      throw new Error('All parameters are required')
    }
    
    const streakData = getStreakData(kidId, streakType)
    const saver = STREAK_SAVERS[saverType]
    
    if (!saver) return false
    
    let newStreak = { ...streakData }
    
    switch (saverType) {
      case 'freeze':
        newStreak.freezeUsed = true
        break
      case 'double':
        newStreak.multiplierActive = true
        break
      case 'boost':
        newStreak.current += 1
        newStreak.best = Math.max(newStreak.best, newStreak.current)
        break
      default:
        return false
    }
    
    const key = `streak_${streakType}_${kidId}`
    localStorage.setItem(key, JSON.stringify(newStreak))
    
    return true
  } catch (error) {
    console.error('Error using streak saver:', error)
    return false
  }
}

export const calculateStreakBonus = (kidId, streakType, baseCoins) => {
  const streakData = getStreakData(kidId, streakType)
  const typeMultiplier = STREAK_TYPES[streakType]?.multiplier || 1
  
  let bonus = 0
  
  // Base streak bonus (1 coin per streak day)
  bonus += Math.min(streakData.current, 10) // Cap at 10 bonus coins
  
  // Type multiplier
  bonus *= typeMultiplier
  
  // Double coins power-up
  if (streakData.multiplierActive) {
    bonus *= 2
    // Reset multiplier after use
    const newStreak = { ...streakData, multiplierActive: false }
    const key = `streak_${streakType}_${kidId}`
    localStorage.setItem(key, JSON.stringify(newStreak))
  }
  
  return Math.round(bonus)
}

export const getAllStreaks = (kidId) => {
  const streaks = {}
  Object.keys(STREAK_TYPES).forEach(type => {
    streaks[type] = getStreakData(kidId, type)
  })
  return streaks
}

export const getStreakStats = (kidId) => {
  const allStreaks = getAllStreaks(kidId)
  
  const totalCurrent = Object.values(allStreaks).reduce((sum, streak) => sum + streak.current, 0)
  const totalBest = Object.values(allStreaks).reduce((sum, streak) => sum + streak.best, 0)
  const longestStreak = Math.max(...Object.values(allStreaks).map(s => s.best))
  const activeStreaks = Object.values(allStreaks).filter(s => s.current > 0).length
  
  return {
    totalCurrent,
    totalBest,
    longestStreak,
    activeStreaks,
    streaks: allStreaks
  }
}

export const getStreakPowerUps = (kidId) => {
  const key = `streak_powerups_${kidId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : { freeze: 0, double: 0, boost: 0 }
}

export const addStreakPowerUp = (kidId, powerUpType, quantity = 1) => {
  const powerUps = getStreakPowerUps(kidId)
  powerUps[powerUpType] = (powerUps[powerUpType] || 0) + quantity
  
  const key = `streak_powerups_${kidId}`
  localStorage.setItem(key, JSON.stringify(powerUps))
}