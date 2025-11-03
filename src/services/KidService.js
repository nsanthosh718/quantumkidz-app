import { StorageRepository } from '../repositories/StorageRepository'
import { ValidationService } from './ValidationService'
import { errorHandler } from '../utils/errorHandler'

export class KidService {
  constructor() {
    this.repository = new StorageRepository()
    this.validator = new ValidationService()
  }

  async getAllKids() {
    try {
      return await this.repository.getKids()
    } catch (error) {
      errorHandler.handle(error, 'KidService.getAllKids')
      return []
    }
  }

  async getKidById(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid Kid ID is required')
      }
      return await this.repository.getKid(id)
    } catch (error) {
      errorHandler.handle(error, 'KidService.getKidById')
      return null
    }
  }

  async createKid(kidData) {
    try {
      if (!kidData || typeof kidData !== 'object' || !kidData.name) {
        throw new Error('Invalid kid data provided')
      }
      
      this.validator.validateKidData(kidData)
      
      const trimmedName = String(kidData.name).trim()
      if (!trimmedName) {
        throw new Error('Kid name cannot be empty')
      }
      
      const normalizedData = {
        ...kidData,
        name: trimmedName,
        id: trimmedName.toLowerCase().replace(/\s+/g, ''),
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

      return await this.repository.addKid(normalizedData)
    } catch (error) {
      errorHandler.handle(error, 'KidService.createKid')
      throw error
    }
  }

  async updateKid(kidData) {
    try {
      if (!kidData || typeof kidData !== 'object' || !kidData.id) {
        throw new Error('Valid kid data with ID is required for update')
      }
      return await this.repository.updateKid(kidData)
    } catch (error) {
      errorHandler.handle(error, 'KidService.updateKid')
      throw error
    }
  }

  async deleteKid(kidId) {
    try {
      this.validator.validateRequired(kidId, 'Kid ID is required for deletion')
      return await this.repository.deleteKid(kidId)
    } catch (error) {
      errorHandler.handle(error, 'KidService.deleteKid')
      throw error
    }
  }

  async updateKidBalance(kidId, coinChange, realMoneyChange = 0) {
    try {
      if (!kidId) {
        throw new Error('Kid ID is required')
      }
      
      if (typeof coinChange !== 'number' || typeof realMoneyChange !== 'number') {
        throw new Error('Balance changes must be numbers')
      }
      
      const kid = await this.getKidById(kidId)
      if (!kid) throw new Error('Kid not found')

      const updatedKid = {
        ...kid,
        coins: Math.max(0, (kid.coins || 0) + coinChange),
        realMoney: Math.max(0, (kid.realMoney || 0) + realMoneyChange)
      }

      return await this.updateKid(updatedKid)
    } catch (error) {
      errorHandler.handle(error, 'KidService.updateKidBalance')
      throw error
    }
  }
}