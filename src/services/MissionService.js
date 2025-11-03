import { StorageRepository } from '../repositories/StorageRepository'
import { ValidationService } from './ValidationService'
import { errorHandler } from '../utils/errorHandler'

export class MissionService {
  constructor() {
    this.repository = new StorageRepository()
    this.validator = new ValidationService()
  }

  async getAllMissions() {
    try {
      return await this.repository.getMissions()
    } catch (error) {
      errorHandler.handle(error, 'MissionService.getAllMissions')
      return []
    }
  }

  async getFilteredMissions(age) {
    try {
      if (typeof age !== 'number' || age < 0) {
        throw new Error('Invalid age provided')
      }
      
      const missions = await this.getAllMissions()
      if (!Array.isArray(missions)) {
        return []
      }
      
      const today = new Date()
      const todayString = today.toDateString()
      const todayDayOfWeek = today.getDay()
      
      return missions.filter(m => {
        if (!m || typeof m !== 'object') return false
        
        const isAgeAppropriate = m.ageGroup === 'both' || 
          (age >= 9 && m.ageGroup === '9+') || 
          (age >= 4 && m.ageGroup === '4+')
        
        let isScheduledForToday = true
        if (m.scheduledDate) {
          try {
            isScheduledForToday = new Date(m.scheduledDate).toDateString() === todayString
          } catch {
            isScheduledForToday = true
          }
        }
        
        const isWeeklyScheduledForToday = !m.weeklyDays || 
          !Array.isArray(m.weeklyDays) ||
          m.weeklyDays.length === 0 || 
          m.weeklyDays.includes(todayDayOfWeek)
        
        return m.status === 'active' && isAgeAppropriate && isScheduledForToday && isWeeklyScheduledForToday
      })
    } catch (error) {
      errorHandler.handle(error, 'MissionService.getFilteredMissions')
      return []
    }
  }

  async createMission(missionData) {
    try {
      if (!missionData || typeof missionData !== 'object') {
        throw new Error('Invalid mission data')
      }
      
      this.validator.validateMissionData(missionData)
      
      const mission = {
        ...missionData,
        status: 'active',
        createdAt: new Date().toISOString()
      }

      return await this.repository.addMission(mission)
    } catch (error) {
      errorHandler.handle(error, 'MissionService.createMission')
      throw error
    }
  }

  async updateMission(missionId, missionData) {
    try {
      this.validator.validateRequired(missionId, 'Mission ID is required')
      return await this.repository.updateMission(missionId, missionData)
    } catch (error) {
      errorHandler.handle(error, 'MissionService.updateMission')
      throw error
    }
  }

  async deleteMission(missionId) {
    try {
      this.validator.validateRequired(missionId, 'Mission ID is required')
      return await this.repository.deleteMission(missionId)
    } catch (error) {
      errorHandler.handle(error, 'MissionService.deleteMission')
      throw error
    }
  }

  async completeMission(kidId, missionId, notes = '') {
    try {
      if (!kidId || !missionId) {
        throw new Error('Kid ID and Mission ID are required')
      }
      
      const missions = await this.getAllMissions()
      if (!Array.isArray(missions)) {
        throw new Error('Failed to load missions')
      }
      
      const mission = missions.find(m => m && m.id === missionId)
      
      if (!mission) {
        throw new Error('Mission not found')
      }

      // This will be handled by TransactionService
      return { mission, notes: notes || '' }
    } catch (error) {
      errorHandler.handle(error, 'MissionService.completeMission')
      throw error
    }
  }

  generateDailyMissions() {
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
    
    const shuffled = missionPool.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5).map((mission, index) => ({
      ...mission,
      id: `daily-${Date.now()}-${index}`,
      status: 'active',
      isDaily: true
    }))
  }
}