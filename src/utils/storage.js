const STORAGE_KEYS = {
  KIDS: 'kids',
  MISSIONS: 'missions',
  TRANSACTIONS: 'transactions'
}

export const initializeData = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.KIDS)) {
      localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify([]))
    }

    refreshDailyMissions()

    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error initializing data:', error)
    // Fallback to in-memory storage if localStorage fails
  }
}

export const refreshDailyMissions = () => {
  try {
    const today = new Date().toDateString()
    const lastRefresh = localStorage.getItem('lastMissionRefresh')
    
    if (lastRefresh !== today) {
      const dailyMissions = generateDailyMissions()
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(dailyMissions))
      localStorage.setItem('lastMissionRefresh', today)
      
      // Reset daily completion status for all kids
      const kids = getKids()
      kids.forEach(kid => {
        kid.dailyMissionsCompleted = []
        updateKid(kid)
      })
    }
  } catch (error) {
    console.error('Error refreshing daily missions:', error)
  }
}

const generateDailyMissions = () => {
  const missionPool = [
    { title: 'Make Your Bed', description: 'Make your bed neatly', ageGroup: 'both', reward: 5, type: 'chore' },
    { title: 'Math Practice', description: 'Complete 10 math problems', ageGroup: '9+', reward: 10, type: 'math' },
    { title: 'Count to 10', description: 'Count from 1 to 10', ageGroup: '4+', reward: 3, type: 'math' },
    { title: 'Help with Dishes', description: 'Help put dishes away', ageGroup: 'both', reward: 8, type: 'chore' },
    { title: 'Focus Time', description: '5 minutes of quiet focus', ageGroup: 'both', reward: 7, type: 'focus' },
    { title: 'Tidy Toys', description: 'Put all toys in their place', ageGroup: '4+', reward: 4, type: 'chore' },
    { title: 'Reading Time', description: 'Read for 15 minutes', ageGroup: '9+', reward: 8, type: 'focus' },
    { title: 'Help Cook', description: 'Help prepare a meal', ageGroup: 'both', reward: 12, type: 'chore' },
    { title: 'Practice Writing', description: 'Write your name 5 times', ageGroup: '4+', reward: 6, type: 'focus' },
    { title: 'Money Math', description: 'Count coins and bills', ageGroup: '9+', reward: 15, type: 'math' }
  ]
  
  // Shuffle and select 5 random missions for today
  const shuffled = missionPool.sort(() => Math.random() - 0.5)
  const dailyMissions = shuffled.slice(0, 5).map((mission, index) => ({
    ...mission,
    id: `daily-${Date.now()}-${index}`,
    status: 'active',
    isDaily: true
  }))
  
  return dailyMissions
}

export const getKids = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.KIDS) || '[]')
  } catch (error) {
    console.error('Error getting kids:', error)
    return []
  }
}

export const getKid = (id) => {
  try {
    if (!id) return null
    return getKids().find(kid => kid.id === id) || null
  } catch (error) {
    console.error('Error getting kid:', error)
    return null
  }
}
export const updateKid = (kidData) => {
  try {
    if (!kidData || typeof kidData !== 'object' || !kidData.id) {
      throw new Error('Invalid kid data provided')
    }
    const kids = getKids()
    if (!Array.isArray(kids)) {
      throw new Error('Failed to load kids data')
    }
    const index = kids.findIndex(k => k && k.id === kidData.id)
    if (index !== -1) {
      kids[index] = { ...kids[index], ...kidData }
      localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify(kids))
    } else {
      console.warn('Kid not found for update:', kidData.id)
    }
  } catch (error) {
    console.error('Error updating kid:', error)
    throw error
  }
}

export const addKid = (name, age, gender = 'boy') => {
  try {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Valid name is required')
    }
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 18) {
      throw new Error('Valid age (1-18) is required')
    }
    
    const kids = getKids()
    if (!Array.isArray(kids)) {
      throw new Error('Failed to load kids data')
    }
    
    const trimmedName = name.trim()
    const kidId = trimmedName.toLowerCase().replace(/\s+/g, '')
    
    // Check for duplicate ID
    if (kids.some(k => k && k.id === kidId)) {
      throw new Error('A kid with this name already exists')
    }
    
    const newKid = {
      id: kidId,
      name: trimmedName,
      age: parseInt(age),
      gender: gender || 'boy',
      coins: 0,
      stars: 0,
      realMoney: 0,
      portfolio: [],
      aiProfile: {
        learningStyle: 'visual',
        financialPersonality: 'balanced',
        engagementLevel: 'medium',
        preferredMissionTypes: ['chore', 'math']
      },
      completedMissions: [],
      createdAt: new Date().toISOString()
    }
    
    kids.push(newKid)
    localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify(kids))
    return newKid
  } catch (error) {
    console.error('Error adding kid:', error)
    throw error
  }
}

export const deleteKid = (kidId) => {
  const kids = getKids().filter(kid => kid.id !== kidId)
  localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify(kids))
}

export const getMissions = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '[]')
  } catch (error) {
    console.error('Error getting missions:', error)
    return []
  }
}
export const addMission = (mission) => {
  const missions = getMissions()
  missions.push({ ...mission, id: Date.now().toString() })
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions))
}

export const updateMission = (missionId, updatedMission) => {
  const missions = getMissions()
  const index = missions.findIndex(m => m.id === missionId)
  if (index !== -1) {
    missions[index] = { ...missions[index], ...updatedMission }
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions))
  }
}

export const deleteMission = (missionId) => {
  const missions = getMissions().filter(m => m.id !== missionId)
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions))
}

export const getFilteredMissions = (age) => {
  refreshDailyMissions() // Ensure missions are fresh
  const missions = getMissions()
  const today = new Date()
  const todayString = today.toDateString()
  const todayDayOfWeek = today.getDay()
  
  return missions.filter(m => {
    const isAgeAppropriate = m.ageGroup === 'both' || 
      (age >= 9 && m.ageGroup === '9+') || 
      (age >= 4 && m.ageGroup === '4+')
    
    const isScheduledForToday = !m.scheduledDate || 
      new Date(m.scheduledDate).toDateString() === todayString
    
    const isWeeklyScheduledForToday = !m.weeklyDays || 
      m.weeklyDays.length === 0 || 
      m.weeklyDays.includes(todayDayOfWeek)
    
    return m.status === 'active' && isAgeAppropriate && isScheduledForToday && isWeeklyScheduledForToday
  })
}

export const getTransactions = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
export const getKidTransactions = (kidId) => getTransactions().filter(t => t.kidId === kidId)

export const completeMission = (kidId, missionId, notes = '') => {
  try {
    if (!kidId || typeof kidId !== 'string') {
      throw new Error('Valid Kid ID is required')
    }
    if (!missionId || typeof missionId !== 'string') {
      throw new Error('Valid Mission ID is required')
    }
    
    const kid = getKid(kidId)
    if (!kid) {
      throw new Error('Kid not found')
    }
    
    const missions = getMissions()
    const mission = missions.find(m => m && m.id === missionId)
    if (!mission) {
      throw new Error('Mission not found')
    }
    
    if (!Array.isArray(kid.completedMissions)) {
      kid.completedMissions = []
    }
    
    if (!kid.completedMissions.includes(missionId)) {
      const reward = typeof mission.reward === 'number' ? mission.reward : 0
      kid.coins = (kid.coins || 0) + reward
      kid.completedMissions.push(missionId)
      updateKid(kid)
      
      const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
      transactions.push({
        id: Date.now().toString(),
        kidId,
        type: 'earn',
        amount: reward,
        description: mission.title || 'Mission completed',
        notes: notes || '',
        timestamp: new Date().toISOString()
      })
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    }
  } catch (error) {
    console.error('Error completing mission:', error)
    throw error
  }
}

export const uncompleteMission = (kidId, missionId) => {
  try {
    if (!kidId || typeof kidId !== 'string') {
      throw new Error('Valid Kid ID is required')
    }
    if (!missionId || typeof missionId !== 'string') {
      throw new Error('Valid Mission ID is required')
    }
    
    const kid = getKid(kidId)
    if (!kid) {
      throw new Error('Kid not found')
    }
    
    const missions = getMissions()
    const mission = missions.find(m => m && m.id === missionId)
    if (!mission) {
      throw new Error('Mission not found')
    }
    
    if (!Array.isArray(kid.completedMissions)) {
      kid.completedMissions = []
    }
    
    if (kid.completedMissions.includes(missionId)) {
      const reward = typeof mission.reward === 'number' ? mission.reward : 0
      kid.coins = Math.max(0, (kid.coins || 0) - reward)
      kid.completedMissions = kid.completedMissions.filter(id => id !== missionId)
      updateKid(kid)
      
      // Remove the transaction
      const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
      const filteredTransactions = transactions.filter(t => 
        !(t && t.kidId === kidId && t.description === mission.title && t.type === 'earn')
      )
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTransactions))
    }
  } catch (error) {
    console.error('Error uncompleting mission:', error)
    throw error
  }
}