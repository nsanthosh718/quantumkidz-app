// Dependency Injection Container for Enterprise Architecture

import { KidService } from './KidService'
import { MissionService } from './MissionService'
import { TransactionService } from './TransactionService'
import { ValidationService } from './ValidationService'

class ServiceContainer {
  constructor() {
    this.services = new Map()
    this.initialize()
  }

  initialize() {
    // Register services
    this.register('validation', new ValidationService())
    this.register('kid', new KidService())
    this.register('mission', new MissionService())
    this.register('transaction', new TransactionService())
  }

  register(name, service) {
    this.services.set(name, service)
  }

  get(name) {
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service '${name}' not found`)
    }
    return service
  }

  // Convenience getters
  get kidService() {
    return this.get('kid')
  }

  get missionService() {
    return this.get('mission')
  }

  get transactionService() {
    return this.get('transaction')
  }

  get validationService() {
    return this.get('validation')
  }
}

// Singleton instance
export const serviceContainer = new ServiceContainer()

// React hook for accessing services
import { useContext, createContext } from 'react'

const ServiceContext = createContext(serviceContainer)

export const ServiceProvider = ({ children }) => (
  <ServiceContext.Provider value={serviceContainer}>
    {children}
  </ServiceContext.Provider>
)

export const useServices = () => {
  const container = useContext(ServiceContext)
  if (!container) {
    throw new Error('useServices must be used within ServiceProvider')
  }
  return container
}