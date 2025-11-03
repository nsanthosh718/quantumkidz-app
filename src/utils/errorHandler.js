// Error handling framework for QuantumKidz

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', severity = 'error') {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.severity = severity
    this.timestamp = new Date().toISOString()
  }
}

export const errorHandler = {
  log: (error, context = '') => {
    const errorLog = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      severity: error.severity || 'error',
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    }
    
    console.error('QuantumKidz Error:', errorLog)
    
    // Store in localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
    errors.push(errorLog)
    if (errors.length > 50) errors.shift() // Keep only last 50 errors
    localStorage.setItem('app_errors', JSON.stringify(errors))
  },

  handle: (error, context = '') => {
    errorHandler.log(error, context)
    
    // Show user-friendly message based on error type
    const userMessage = errorHandler.getUserMessage(error)
    errorHandler.showToast(userMessage, error.severity || 'error')
  },

  getUserMessage: (error) => {
    const messages = {
      STORAGE_ERROR: 'Unable to save data. Please try again.',
      NETWORK_ERROR: 'Connection problem. Check your internet.',
      VALIDATION_ERROR: error.message,
      MISSION_ERROR: 'Mission could not be completed. Please try again.',
      UNKNOWN_ERROR: 'Something went wrong. Please try again.'
    }
    return messages[error.code] || messages.UNKNOWN_ERROR
  },

  showToast: (message, severity = 'error') => {
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      background: ${severity === 'error' ? '#f44336' : severity === 'warning' ? '#ff9800' : '#4caf50'};
    `
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 4000)
  }
}

export const withErrorHandling = (fn, context = '') => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorHandler.handle(error, context)
      throw error
    }
  }
}

export const validateInput = (value, rules) => {
  for (const rule of rules) {
    if (rule.required && (!value || value.trim() === '')) {
      throw new AppError(rule.message || 'This field is required', 'VALIDATION_ERROR')
    }
    if (rule.minLength && value.length < rule.minLength) {
      throw new AppError(rule.message || `Minimum ${rule.minLength} characters required`, 'VALIDATION_ERROR')
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      throw new AppError(rule.message || `Maximum ${rule.maxLength} characters allowed`, 'VALIDATION_ERROR')
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      throw new AppError(rule.message || 'Invalid format', 'VALIDATION_ERROR')
    }
  }
  return true
}