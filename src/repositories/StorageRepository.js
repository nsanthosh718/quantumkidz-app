const STORAGE_KEYS = {
  KIDS: 'kids',
  MISSIONS: 'missions',
  TRANSACTIONS: 'transactions'
}

export class StorageRepository {
  async getItem(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key}:`, error)
      return null
    }
  }

  async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting item ${key}:`, error)
      return false
    }
  }

  async getKids() {
    const kids = await this.getItem(STORAGE_KEYS.KIDS)
    return kids || []
  }

  async getKid(id) {
    try {
      if (!id) return null
      const kids = await this.getKids()
      return kids.find(kid => kid && kid.id === id) || null
    } catch (error) {
      console.error('Error getting kid:', error)
      return null
    }
  }

  async addKid(kidData) {
    try {
      if (!kidData || !kidData.id) {
        throw new Error('Invalid kid data')
      }
      const kids = await this.getKids()
      kids.push(kidData)
      await this.setItem(STORAGE_KEYS.KIDS, kids)
      return kidData
    } catch (error) {
      console.error('Error adding kid:', error)
      throw error
    }
  }

  async updateKid(kidData) {
    try {
      if (!kidData || !kidData.id) {
        throw new Error('Invalid kid data')
      }
      const kids = await this.getKids()
      const index = kids.findIndex(k => k && k.id === kidData.id)
      if (index !== -1) {
        kids[index] = { ...kids[index], ...kidData }
        await this.setItem(STORAGE_KEYS.KIDS, kids)
        return kids[index]
      }
      return null
    } catch (error) {
      console.error('Error updating kid:', error)
      throw error
    }
  }

  async deleteKid(kidId) {
    try {
      if (!kidId) {
        throw new Error('Kid ID is required')
      }
      const kids = await this.getKids()
      const filteredKids = kids.filter(k => k && k.id !== kidId)
      await this.setItem(STORAGE_KEYS.KIDS, filteredKids)
      return true
    } catch (error) {
      console.error('Error deleting kid:', error)
      throw error
    }
  }

  async getMissions() {
    const missions = await this.getItem(STORAGE_KEYS.MISSIONS)
    return missions || []
  }

  async addMission(missionData) {
    const missions = await this.getMissions()
    const mission = { ...missionData, id: Date.now().toString() }
    missions.push(mission)
    await this.setItem(STORAGE_KEYS.MISSIONS, missions)
    return mission
  }

  async updateMission(missionId, missionData) {
    const missions = await this.getMissions()
    const index = missions.findIndex(m => m.id === missionId)
    if (index !== -1) {
      missions[index] = { ...missions[index], ...missionData }
      await this.setItem(STORAGE_KEYS.MISSIONS, missions)
      return missions[index]
    }
    return null
  }

  async deleteMission(missionId) {
    const missions = await this.getMissions()
    const filteredMissions = missions.filter(m => m.id !== missionId)
    await this.setItem(STORAGE_KEYS.MISSIONS, filteredMissions)
    return true
  }

  async getTransactions() {
    const transactions = await this.getItem(STORAGE_KEYS.TRANSACTIONS)
    return transactions || []
  }

  async addTransaction(transactionData) {
    try {
      if (!transactionData || !transactionData.kidId) {
        throw new Error('Invalid transaction data')
      }
      const transactions = await this.getTransactions()
      const transaction = { 
        ...transactionData, 
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      transactions.push(transaction)
      await this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions)
      return transaction
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  async getKidTransactions(kidId) {
    try {
      if (!kidId) return []
      const transactions = await this.getTransactions()
      return transactions.filter(t => t && t.kidId === kidId)
    } catch (error) {
      console.error('Error getting kid transactions:', error)
      return []
    }
  }
}