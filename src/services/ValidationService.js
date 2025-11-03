export class ValidationService {
  validateRequired(value, message = 'Field is required') {
    try {
      if (!value || (typeof value === 'string' && !value.trim())) {
        throw new Error(message)
      }
    } catch (error) {
      console.error('Validation error:', error.message)
      throw error
    }
  }

  validateKidData(kidData) {
    try {
      if (!kidData || typeof kidData !== 'object') {
        throw new Error('Invalid kid data provided')
      }
      
      this.validateRequired(kidData?.name, 'Kid name is required')
      this.validateRequired(kidData?.age, 'Kid age is required')
      
      const age = parseInt(kidData.age)
      if (isNaN(age) || age < 3 || age > 18) {
        throw new Error('Age must be between 3 and 18')
      }
      
      if (kidData.name.length > 50) {
        throw new Error('Name must be less than 50 characters')
      }
    } catch (error) {
      console.error('Kid data validation error:', error.message)
      throw error
    }
  }

  validateMissionData(missionData) {
    try {
      if (!missionData || typeof missionData !== 'object') {
        throw new Error('Invalid mission data provided')
      }
      
      this.validateRequired(missionData?.title, 'Mission title is required')
      this.validateRequired(missionData?.description, 'Mission description is required')
      
      const reward = parseInt(missionData.reward)
      if (isNaN(reward) || reward < 1 || reward > 100) {
        throw new Error('Reward must be between 1 and 100 coins')
      }
    } catch (error) {
      console.error('Mission data validation error:', error.message)
      throw error
    }
  }

  validateAmount(amount, maxAmount = null) {
    try {
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      if (maxAmount !== null && numAmount > maxAmount) {
        throw new Error(`Amount cannot exceed ${maxAmount}`)
      }
    } catch (error) {
      console.error('Amount validation error:', error.message)
      throw error
    }
  }
}