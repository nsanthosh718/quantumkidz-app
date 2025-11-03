import { useState } from 'react'
import MoneyActions from './MoneyActions'
import StockMarket from './StockMarket'
import Calendar from './Calendar'

function WalletHub({ kid }) {
  const [activeSection, setActiveSection] = useState('money')

  if (!kid) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">💰 My Wallet</h3>
        <p>Please select a kid profile to access the wallet.</p>
      </div>
    )
  }

  return (
    <div className="card slide-in">
      <h3 className="mb-4">💰 My Wallet</h3>
      
      {/* Sub-navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveSection('money')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'money' ? '#4CAF50' : '#f0f0f0',
              color: activeSection === 'money' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            💰 Money Actions
          </button>
          <button 
            onClick={() => setActiveSection('stocks')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'stocks' ? '#2196F3' : '#f0f0f0',
              color: activeSection === 'stocks' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📈 Investments
          </button>
          <button 
            onClick={() => setActiveSection('history')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeSection === 'history' ? '#FF9800' : '#f0f0f0',
              color: activeSection === 'history' ? 'white' : '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📅 History
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'money' && <MoneyActions kid={kid} />}
      {activeSection === 'stocks' && <StockMarket kid={kid} />}
      {activeSection === 'history' && <Calendar kidId={kid?.id} />}
    </div>
  )
}

export default WalletHub