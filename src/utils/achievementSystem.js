// Achievement System for QuantumKidz

export const ACHIEVEMENTS = {
  // Streak Achievements
  streak_3: { id: 'streak_3', name: 'Getting Started', description: '3 day login streak', emoji: '🔥', rarity: 'common', points: 10 },
  streak_7: { id: 'streak_7', name: 'Week Warrior', description: '7 day login streak', emoji: '⚡', rarity: 'uncommon', points: 25 },
  streak_30: { id: 'streak_30', name: 'Month Master', description: '30 day login streak', emoji: '💎', rarity: 'rare', points: 100 },
  
  // Mission Achievements
  missions_10: { id: 'missions_10', name: 'Mission Rookie', description: 'Complete 10 missions', emoji: '🎯', rarity: 'common', points: 15 },
  missions_50: { id: 'missions_50', name: 'Mission Expert', description: 'Complete 50 missions', emoji: '🏹', rarity: 'uncommon', points: 50 },
  missions_100: { id: 'missions_100', name: 'Mission Legend', description: 'Complete 100 missions', emoji: '🏆', rarity: 'epic', points: 150 },
  
  // Game Achievements
  math_perfect: { id: 'math_perfect', name: 'Math Genius', description: 'Perfect score in math game', emoji: '🧮', rarity: 'uncommon', points: 30 },
  all_games: { id: 'all_games', name: 'Game Explorer', description: 'Play all game types', emoji: '🎮', rarity: 'rare', points: 75 },
  speed_demon: { id: 'speed_demon', name: 'Speed Demon', description: 'Answer 10 questions in under 30 seconds', emoji: '⚡', rarity: 'rare', points: 60 },
  
  // Coin Achievements
  coins_100: { id: 'coins_100', name: 'Coin Collector', description: 'Earn 100 coins', emoji: '💰', rarity: 'common', points: 20 },
  coins_500: { id: 'coins_500', name: 'Treasure Hunter', description: 'Earn 500 coins', emoji: '💎', rarity: 'uncommon', points: 40 },
  coins_1000: { id: 'coins_1000', name: 'Millionaire', description: 'Earn 1000 coins', emoji: '👑', rarity: 'epic', points: 100 },
  
  // Special Achievements
  early_bird: { id: 'early_bird', name: 'Early Bird', description: 'Complete mission before 9 AM', emoji: '🌅', rarity: 'uncommon', points: 25 },
  night_owl: { id: 'night_owl', name: 'Night Owl', description: 'Complete mission after 8 PM', emoji: '🦉', rarity: 'uncommon', points: 25 },
  weekend_warrior: { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete 5 missions on weekend', emoji: '🏋️', rarity: 'rare', points: 50 },
  
  // Rare Achievements
  perfectionist: { id: 'perfectionist', name: 'Perfectionist', description: '100% accuracy for a week', emoji: '✨', rarity: 'legendary', points: 200 },
  champion: { id: 'champion', name: 'Weekly Champion', description: 'Win weekly tournament', emoji: '🏆', rarity: 'legendary', points: 250 }
}

export const RARITY_COLORS = {
  common: '#9E9E9E',
  uncommon: '#4CAF50', 
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800'
}

export const getUserAchievements = (kidId) => {
  try {
    if (!kidId) return []
    const key = `achievements_${kidId}`
    const achievements = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(achievements) ? achievements : []
  } catch (error) {
    console.error('Error getting user achievements:', error)
    return []
  }
}

export const unlockAchievement = (kidId, achievementId) => {
  try {
    if (!kidId || !achievementId || !ACHIEVEMENTS[achievementId]) {
      return null
    }
    
    const userAchievements = getUserAchievements(kidId)
    
    if (!userAchievements.includes(achievementId)) {
      userAchievements.push(achievementId)
      const key = `achievements_${kidId}`
      localStorage.setItem(key, JSON.stringify(userAchievements))
      
      // Store unlock timestamp
      const timestampKey = `achievement_time_${kidId}_${achievementId}`
      localStorage.setItem(timestampKey, new Date().toISOString())
      
      return ACHIEVEMENTS[achievementId]
    }
    return null
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    return null
  }
}

export const checkAchievements = (kidId, stats) => {
  try {
    if (!kidId || !stats || typeof stats !== 'object') {
      return []
    }
    
    const newAchievements = []
    
    // Streak achievements
    if (typeof stats.loginStreak === 'number') {
      if (stats.loginStreak >= 3) newAchievements.push(unlockAchievement(kidId, 'streak_3'))
      if (stats.loginStreak >= 7) newAchievements.push(unlockAchievement(kidId, 'streak_7'))
      if (stats.loginStreak >= 30) newAchievements.push(unlockAchievement(kidId, 'streak_30'))
    }
    
    // Mission achievements
    if (typeof stats.totalMissions === 'number') {
      if (stats.totalMissions >= 10) newAchievements.push(unlockAchievement(kidId, 'missions_10'))
      if (stats.totalMissions >= 50) newAchievements.push(unlockAchievement(kidId, 'missions_50'))
      if (stats.totalMissions >= 100) newAchievements.push(unlockAchievement(kidId, 'missions_100'))
    }
    
    // Coin achievements
    if (typeof stats.totalCoins === 'number') {
      if (stats.totalCoins >= 100) newAchievements.push(unlockAchievement(kidId, 'coins_100'))
      if (stats.totalCoins >= 500) newAchievements.push(unlockAchievement(kidId, 'coins_500'))
      if (stats.totalCoins >= 1000) newAchievements.push(unlockAchievement(kidId, 'coins_1000'))
    }
    
    // Game achievements
    if (typeof stats.perfectGames === 'number' && stats.perfectGames > 0) {
      newAchievements.push(unlockAchievement(kidId, 'math_perfect'))
    }
    if (Array.isArray(stats.gamesPlayed) && stats.gamesPlayed.length >= 4) {
      newAchievements.push(unlockAchievement(kidId, 'all_games'))
    }
    
    // Time-based achievements
    try {
      const hour = new Date().getHours()
      if (hour < 9 && stats.lastMissionTime) newAchievements.push(unlockAchievement(kidId, 'early_bird'))
      if (hour >= 20 && stats.lastMissionTime) newAchievements.push(unlockAchievement(kidId, 'night_owl'))
    } catch (timeError) {
      console.error('Error checking time-based achievements:', timeError)
    }
    
    return newAchievements.filter(Boolean)
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

export const getAchievementStats = (kidId) => {
  try {
    if (!kidId) {
      return {
        total: 0,
        totalPoints: 0,
        rarityCount: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
        completion: 0
      }
    }
    
    const achievements = getUserAchievements(kidId)
    const totalPoints = achievements.reduce((sum, id) => {
      const achievement = ACHIEVEMENTS[id]
      return sum + (achievement && typeof achievement.points === 'number' ? achievement.points : 0)
    }, 0)
    
    const rarityCount = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
    
    achievements.forEach(id => {
      const achievement = ACHIEVEMENTS[id]
      if (achievement && achievement.rarity && rarityCount.hasOwnProperty(achievement.rarity)) {
        rarityCount[achievement.rarity]++
      }
    })
    
    const totalAchievements = Object.keys(ACHIEVEMENTS).length
    const completion = totalAchievements > 0 ? Math.round((achievements.length / totalAchievements) * 100) : 0
    
    return {
      total: achievements.length,
      totalPoints,
      rarityCount,
      completion
    }
  } catch (error) {
    console.error('Error getting achievement stats:', error)
    return {
      total: 0,
      totalPoints: 0,
      rarityCount: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
      completion: 0
    }
  }
}