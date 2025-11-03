import { StorageRepository } from '../repositories/StorageRepository'
import { KidService } from './KidService'
import { ValidationService } from './ValidationService'
import { errorHandler } from '../utils/errorHandler'

export class TransactionService {
  constructor() {
    this.repository = new StorageRepository()
    this.kidService = new KidService()
    this.validator = new ValidationService()
  }

  async recordTransaction(transactionData) {
    try {
      if (!transactionData) {
        throw new Error('Transaction data is required')
      }
      
      this.validator.validateRequired(transactionData.kidId, 'Kid ID is required')
      this.validator.validateRequired(transactionData.type, 'Transaction type is required')
      
      if (transactionData.amount !== undefined && (typeof transactionData.amount !== 'number' || transactionData.amount < 0)) {
        throw new Error('Invalid amount')
      }
      
      const transaction = {
        id: Date.now().toString(),
        kidId: transactionData.kidId,
        type: transactionData.type,
        amount: transactionData.amount || 0,
        description: transactionData.description || '',
        notes: transactionData.notes || '',
        timestamp: new Date().toISOString()
      }
      
      return await this.repository.addTransaction(transaction)
    } catch (error) {
      errorHandler.handle(error, 'TransactionService.recordTransaction')
      throw error
    }
  }

  async completeMission(kidId, missionId, notes = '') {
    try {
      this.validator.validateRequired(kidId, 'Kid ID is required')
      this.validator.validateRequired(missionId, 'Mission ID is required')

      const kid = await this.kidService.getKidById(kidId)
      if (!kid) throw new Error('Kid not found')

      if (kid.completedMissions?.includes(missionId)) {
        throw new Error('Mission already completed')
      }

      const missions = await this.repository.getMissions()
      const mission = missions.find(m => m.id === missionId)
      if (!mission) throw new Error('Mission not found')

      // Validate mission reward
      if (typeof mission.reward !== 'number' || mission.reward < 0) {
        throw new Error('Invalid mission reward')
      }

      // Update kid's completed missions and coins
      const updatedKid = {
        ...kid,
        coins: (kid.coins || 0) + mission.reward,
        completedMissions: [...(kid.completedMissions || []), missionId]
      }

      await this.kidService.updateKid(updatedKid)

      // Record transaction
      await this.recordTransaction({
        kidId,
        type: 'earn',
        amount: mission.reward,
        description: mission.title,
        notes,
        missionId
      })

      return updatedKid
    } catch (error) {
      errorHandler.handle(error, 'TransactionService.completeMission')
      throw error
    }
  }

  async uncompleteMission(kidId, missionId) {
    try {
      this.validator.validateRequired(kidId, 'Kid ID is required')
      this.validator.validateRequired(missionId, 'Mission ID is required')
      
      const kid = await this.kidService.getKidById(kidId)
      if (!kid) throw new Error('Kid not found')

      const missions = await this.repository.getMissions()
      const mission = missions.find(m => m.id === missionId)
      if (!mission) throw new Error('Mission not found')

      if (!kid.completedMissions?.includes(missionId)) {
        throw new Error('Mission not completed yet')
      }

      // Update kid's data
      const updatedKid = {
        ...kid,
        coins: Math.max(0, (kid.coins || 0) - mission.reward),
        completedMissions: kid.completedMissions.filter(id => id !== missionId)
      }

      await this.kidService.updateKid(updatedKid)

      // Remove transaction
      const transactions = await this.repository.getTransactions()
      const filteredTransactions = transactions.filter(t => 
        !(t.kidId === kidId && t.missionId === missionId && t.type === 'earn')
      )
      await this.repository.setItem('transactions', filteredTransactions)

      return updatedKid
    } catch (error) {
      errorHandler.handle(error, 'TransactionService.uncompleteMission')
      throw error
    }
  }

  async processMoneyAction(kidId, actionType, amount) {
    try {
      if (!kidId) {
        throw new Error('Kid ID is required')
      }
      if (!actionType) {
        throw new Error('Action type is required')
      }
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Invalid amount')
      }

      const kid = await this.kidService.getKidById(kidId)
      if (!kid) throw new Error('Kid not found')

      let updatedKid
      let transactionType = actionType

      if (['Saved', 'Spent', 'Gave'].includes(actionType)) {
        // Coin transactions
        if ((kid.coins || 0) < amount) {
          throw new Error('Insufficient coins')
        }
        updatedKid = {
          ...kid,
          coins: (kid.coins || 0) - amount
        }
      } else if (actionType === 'Add') {
        // Add real money
        updatedKid = {
          ...kid,
          realMoney: (kid.realMoney || 0) + amount
        }
      } else if (actionType === 'Spend') {
        // Spend real money
        if ((kid.realMoney || 0) < amount) {
          throw new Error('Insufficient real money')
        }
        updatedKid = {
          ...kid,
          realMoney: (kid.realMoney || 0) - amount
        }
      } else {
        throw new Error('Invalid action type')
      }

      if (!updatedKid) {
        throw new Error('Failed to process money action')
      }

      const result = await this.kidService.updateKid(updatedKid)
      if (!result) {
        throw new Error('Failed to update kid data')
      }

      // Record transaction
      await this.recordTransaction({
        kidId,
        type: transactionType,
        amount,
        description: this.getTransactionDescription(actionType, amount)
      })

      return updatedKid
    } catch (error) {
      errorHandler.handle(error, 'TransactionService.processMoneyAction')
      throw error
    }
  }

  async getKidTransactions(kidId) {
    try {
      return await this.repository.getKidTransactions(kidId)
    } catch (error) {
      errorHandler.handle(error, 'TransactionService.getKidTransactions')
      return []
    }
  }

  getTransactionDescription(actionType, amount) {
    const descriptions = {
      'Saved': `Saved ${amount} coins`,
      'Spent': `Spent ${amount} coins`,
      'Gave': `Gave ${amount} coins`,
      'Add': 'Added to savings',
      'Spend': 'Spent earnings'
    }
    return descriptions[actionType] || `${actionType}: ${amount}`
  }
}