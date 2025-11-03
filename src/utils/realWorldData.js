// Real-world integration for stock market and economic data

export const getKidFriendlyStocks = () => [
  { symbol: 'DIS', name: 'Disney', price: 95.50, change: +2.1, emoji: '🏰' },
  { symbol: 'AAPL', name: 'Apple', price: 185.20, change: -1.5, emoji: '📱' },
  { symbol: 'TSLA', name: 'Tesla', price: 248.75, change: +5.2, emoji: '🚗' },
  { symbol: 'NFLX', name: 'Netflix', price: 445.30, change: +0.8, emoji: '📺' },
  { symbol: 'AMZN', name: 'Amazon', price: 142.80, change: -0.3, emoji: '📦' }
]

export const getEconomicFactsForKids = () => [
  "💡 Did you know? A dollar today is worth more than a dollar tomorrow because of inflation!",
  "🏦 Banks pay you interest when you save money with them - it's like getting paid to save!",
  "📈 The stock market is where people buy tiny pieces of companies they believe in",
  "💰 Compound interest is like a snowball - the longer you save, the faster your money grows!",
  "🌍 Different countries have different money - like euros in Europe and yen in Japan!"
]

export const simulateStockPurchase = (kidId, symbol, amount) => {
  try {
    if (!kidId || !symbol || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid parameters for stock purchase')
    }
    
    const stocks = getKidFriendlyStocks()
    if (!Array.isArray(stocks)) {
      throw new Error('Failed to load stock data')
    }
    
    const stock = stocks.find(s => s && s.symbol === symbol)
    
    if (!stock || !stock.price || stock.price <= 0) {
      return null
    }
    
    const shares = amount / stock.price
    
    return {
      id: Date.now().toString(),
      kidId,
      symbol: stock.symbol,
      name: stock.name,
      shares: parseFloat(shares.toFixed(4)),
      purchasePrice: stock.price,
      purchaseDate: new Date().toISOString(),
      currentValue: shares * stock.price
    }
  } catch (error) {
    console.error('Error simulating stock purchase:', error)
    return null
  }
}

export const getPortfolioValue = (portfolio) => {
  try {
    if (!Array.isArray(portfolio)) {
      return 0
    }
    
    const currentStocks = getKidFriendlyStocks()
    if (!Array.isArray(currentStocks)) {
      return 0
    }
    
    return portfolio.reduce((total, holding) => {
      if (!holding || typeof holding !== 'object') {
        return total
      }
      
      const currentStock = currentStocks.find(s => s && s.symbol === holding.symbol)
      const price = (currentStock && currentStock.price) || holding.purchasePrice || 0
      const shares = holding.shares || 0
      const currentValue = shares * price
      
      return total + (isNaN(currentValue) ? 0 : currentValue)
    }, 0)
  } catch (error) {
    console.error('Error calculating portfolio value:', error)
    return 0
  }
}

export const generateEconomicMissions = (currentEvents = []) => [
  {
    id: `econ-${Date.now()}-1`,
    title: 'Stock Market Explorer',
    description: 'Learn about your favorite companies and how they make money',
    ageGroup: '9+',
    reward: 15,
    type: 'economics',
    status: 'active',
    realWorldConnection: true
  },
  {
    id: `econ-${Date.now()}-2`,
    title: 'Inflation Detective',
    description: 'Compare prices from 10 years ago to today - what changed?',
    ageGroup: '9+',
    reward: 12,
    type: 'economics',
    status: 'active',
    realWorldConnection: true
  }
]