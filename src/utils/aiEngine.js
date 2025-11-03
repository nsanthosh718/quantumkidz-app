// AI Learning Engine for personalized mission generation and analytics

export const analyzeKidPerformance = (kid, transactions) => {
  try {
    if (!kid || typeof kid !== 'object') {
      throw new Error('Invalid kid data')
    }
    
    if (!Array.isArray(transactions)) {
      transactions = []
    }
    
    const completedMissions = Array.isArray(kid.completedMissions) ? kid.completedMissions : []
    const completionRate = completedMissions.length / Math.max(completedMissions.length + 5, 1)
    const avgCoinsPerMission = (kid.coins || 0) / Math.max(completedMissions.length, 1)
    
    const validTransactions = transactions.filter(t => t && typeof t === 'object' && t.type)
    const spendingPattern = validTransactions.filter(t => t.type === 'Spent' || t.type === 'Gave').length
    const savingPattern = validTransactions.filter(t => t.type === 'Saved' || t.type === 'Add').length
  
    return {
      completionRate: Math.max(0, Math.min(1, completionRate)),
      avgCoinsPerMission: Math.max(0, avgCoinsPerMission),
      financialPersonality: spendingPattern > savingPattern ? 'spender' : 'saver',
      engagementLevel: completionRate > 0.7 ? 'high' : completionRate > 0.4 ? 'medium' : 'low',
      preferredMissionTypes: getMissionPreferences(kid),
      nextRecommendedDifficulty: getRecommendedDifficulty(kid)
    }
  } catch (error) {
    console.error('Error analyzing kid performance:', error)
    return {
      completionRate: 0,
      avgCoinsPerMission: 0,
      financialPersonality: 'balanced',
      engagementLevel: 'low',
      preferredMissionTypes: ['chore', 'math'],
      nextRecommendedDifficulty: 5
    }
  }
}

const getMissionPreferences = (kid) => {
  try {
    if (!kid || typeof kid !== 'object') {
      return ['chore', 'math', 'focus', 'kindness']
    }
    
    // Simple AI: analyze which mission types they complete most
    const missionTypes = ['chore', 'math', 'focus', 'kindness']
    return missionTypes.sort(() => Math.random() - 0.5) // Randomized for now, will be ML-based
  } catch (error) {
    console.error('Error getting mission preferences:', error)
    return ['chore', 'math', 'focus', 'kindness']
  }
}

const getRecommendedDifficulty = (kid) => {
  try {
    if (!kid || typeof kid.age !== 'number') {
      return 5 // Default difficulty
    }
    
    const baseReward = kid.age <= 6 ? 3 : kid.age <= 10 ? 5 : 8
    const completedMissions = kid.completedMissions || []
    const performanceMultiplier = completedMissions.length > 10 ? 1.5 : 1
    return Math.round(baseReward * performanceMultiplier)
  } catch (error) {
    console.error('Error calculating recommended difficulty:', error)
    return 5
  }
}

export const generatePersonalizedMissions = (kid, existingMissions) => {
  try {
    if (!kid || typeof kid !== 'object' || !kid.name || !kid.id) {
      throw new Error('Invalid kid data provided')
    }
    
    const analysis = analyzeKidPerformance(kid, [])
    const difficulty = Math.max(1, analysis.nextRecommendedDifficulty)
    const kidName = String(kid.name).replace(/[<>"'&]/g, '') // Sanitize name
    const personality = analysis.financialPersonality || 'balanced'
    
    const personalizedMissions = [
      {
        id: `ai-${Date.now()}-1`,
        title: `${kidName}'s Special Challenge`,
        description: `A mission designed just for you based on your ${personality} personality!`,
        ageGroup: (kid.age || 7) <= 6 ? '4+' : '9+',
        reward: difficulty,
        type: analysis.preferredMissionTypes[0] || 'chore',
        status: 'active',
        isAIGenerated: true,
        personalizedFor: kid.id
      },
      {
        id: `ai-${Date.now()}-2`,
        title: 'Smart Money Decision',
        description: `Practice your ${personality === 'saver' ? 'spending' : 'saving'} skills`,
        ageGroup: (kid.age || 7) <= 6 ? '4+' : '9+',
        reward: difficulty + 2,
        type: 'focus',
        status: 'active',
        isAIGenerated: true,
        personalizedFor: kid.id
      }
    ]
    
    return personalizedMissions
  } catch (error) {
    console.error('Error generating personalized missions:', error)
    return []
  }
}

export const getAdvancedAnalytics = (kid, transactions) => {
  try {
    if (!kid || typeof kid !== 'object') {
      throw new Error('Invalid kid data')
    }
    
    const analysis = analyzeKidPerformance(kid, transactions)
    const kidName = String(kid.name || 'Child').replace(/[<>"'&]/g, '')
    const personality = analysis.financialPersonality || 'balanced'
    const engagementLevel = analysis.engagementLevel || 'low'
    const preferredTypes = Array.isArray(analysis.preferredMissionTypes) ? analysis.preferredMissionTypes : ['chore']
    
    return {
      ...analysis,
      insights: [
        `${kidName} shows ${engagementLevel} engagement with financial learning`,
        `Primary financial personality: ${personality}`,
        `Recommended focus: ${personality === 'saver' ? 'Smart spending decisions' : 'Building saving habits'}`
      ],
      projections: {
        weeklyEarningPotential: Math.max(0, analysis.avgCoinsPerMission * 7),
        monthlyGrowthRate: Math.max(0, Math.min(100, analysis.completionRate * 100)),
        skillDevelopmentAreas: preferredTypes.slice(0, 2)
      },
      recommendations: [
        `Increase ${preferredTypes[0]} missions by 20%`,
        `Introduce ${personality === 'saver' ? 'spending' : 'saving'} challenges`,
        `Set weekly goal of ${Math.max(1, Math.ceil(analysis.avgCoinsPerMission * 5))} coins`
      ]
    }
  } catch (error) {
    console.error('Error generating advanced analytics:', error)
    return {
      completionRate: 0,
      avgCoinsPerMission: 0,
      financialPersonality: 'balanced',
      engagementLevel: 'low',
      preferredMissionTypes: ['chore'],
      nextRecommendedDifficulty: 5,
      insights: ['Unable to generate insights at this time'],
      projections: {
        weeklyEarningPotential: 0,
        monthlyGrowthRate: 0,
        skillDevelopmentAreas: ['chore']
      },
      recommendations: ['Complete more missions to get personalized recommendations']
    }
  }
}