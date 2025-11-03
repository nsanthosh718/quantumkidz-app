import { useState } from 'react'
import { getKidFriendlyStocks, simulateStockPurchase, getEconomicFactsForKids } from '../utils/realWorldData'
import { updateKid } from '../utils/storage'

function StockMarket({ kid }) {
  const [selectedStock, setSelectedStock] = useState(null)
  const [investAmount, setInvestAmount] = useState('')
  const [showFacts, setShowFacts] = useState(false)
  
  if (!kid) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">📈 Kid-Friendly Stock Market</h3>
        <p>Please select a kid profile to access the stock market.</p>
      </div>
    )
  }
  
  let stocks, facts
  try {
    stocks = getKidFriendlyStocks() || []
    facts = getEconomicFactsForKids() || []
  } catch (error) {
    console.error('Error loading stock market data:', error)
    stocks = []
    facts = ['Unable to load economic facts at this time.']
  }
  
  const portfolio = Array.isArray(kid.portfolio) ? kid.portfolio : []

  const handleInvest = () => {
    try {
      if (!kid || !kid.id) {
        alert('Invalid kid profile. Please try again.')
        return
      }
      
      const amount = parseFloat(investAmount)
      if (!selectedStock || !amount || amount <= 0) {
        alert('Please select a stock and enter a valid amount.')
        return
      }
      
      if (amount > (kid.realMoney || 0)) {
        alert('Insufficient funds for this investment.')
        return
      }

      const purchase = simulateStockPurchase(kid.id, selectedStock.symbol, amount)
      if (purchase) {
        const updatedKid = {
          ...kid,
          realMoney: (kid.realMoney || 0) - amount,
          portfolio: [...portfolio, purchase]
        }
        updateKid(updatedKid)
        setInvestAmount('')
        setSelectedStock(null)
        alert(`Successfully invested $${amount.toFixed(2)} in ${selectedStock.name}!`)
      } else {
        alert('Failed to complete the investment. Please try again.')
      }
    } catch (error) {
      console.error('Error processing investment:', error)
      alert('An error occurred while processing your investment. Please try again.')
    }
  }

  return (
    <div className="card slide-in">
      <h3 className="mb-4">📈 Kid-Friendly Stock Market</h3>
      
      {/* Economic Facts */}
      <button 
        className="btn btn-secondary"
        onClick={() => setShowFacts(!showFacts)}
        style={{ marginBottom: '16px' }}
      >
        💡 Learn Economic Facts
      </button>
      
      {showFacts && (
        <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          {facts[Math.floor(Math.random() * facts.length)]}
        </div>
      )}

      {/* Available Money */}
      <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
        <strong>Available to invest: ${(kid.realMoney || 0).toFixed(2)}</strong>
      </div>

      {/* Stock List */}
      <div style={{ marginBottom: '16px' }}>
        <h4>🏢 Companies You Know</h4>
        {stocks.map(stock => (
          <div 
            key={stock.symbol}
            onClick={() => setSelectedStock(stock)}
            style={{
              background: selectedStock?.symbol === stock.symbol ? '#e8f5e8' : '#f8f9fa',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '8px',
              cursor: 'pointer',
              border: selectedStock?.symbol === stock.symbol ? '2px solid #4CAF50' : '1px solid #ddd'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>{stock.emoji}</span>
                <strong>{stock.name}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>{stock.symbol}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>${stock.price}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: stock.change >= 0 ? '#4CAF50' : '#f44336' 
                }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Form */}
      {selectedStock && (
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4>💰 Invest in {selectedStock.name}</h4>
          <input 
            type="number"
            step="0.01"
            placeholder="Amount to invest ($)"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          />
          <button 
            className="btn btn-primary"
            onClick={handleInvest}
            disabled={!investAmount || parseFloat(investAmount) > (kid.realMoney || 0)}
          >
            🚀 Buy Shares
          </button>
        </div>
      )}

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div>
          <h4>📊 Your Portfolio</h4>
          {portfolio.map(holding => (
            <div key={holding.id} style={{ 
              background: '#f0f8ff', 
              padding: '8px 12px', 
              margin: '4px 0', 
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>{holding.name}</strong> - {holding.shares} shares
              <div style={{ fontSize: '12px', color: '#666' }}>
                Bought at ${holding.purchasePrice}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StockMarket