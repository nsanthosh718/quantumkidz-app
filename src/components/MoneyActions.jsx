import { useState, useMemo } from 'react'
import { updateKid, getKidTransactions } from '../utils/storage'
import { errorHandler, AppError, withErrorHandling } from '../utils/errorHandler'

function MoneyActions({ kid }) {
  const [amount, setAmount] = useState('')
  const [realMoneyAmount, setRealMoneyAmount] = useState('')
  const [action, setAction] = useState('')
  const [activeTab, setActiveTab] = useState('coins')
  const allTransactions = getKidTransactions(kid?.id || '')
  const moneyTransactions = useMemo(() => 
    allTransactions.filter(t => 
      t.type === 'Add' || t.type === 'Spend' || t.type === 'Saved' || t.type === 'Spent' || t.type === 'Gave'
    ), [allTransactions]
  )
  
  const getEmoji = (type) => {
    const emojis = {
      earn: '💰',
      Add: '🏦',
      Spend: '🛍️',
      Saved: '🏦',
      Spent: '🛍️',
      Gave: '💝'
    }
    return emojis[type] || '⭐'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAction = withErrorHandling((actionType) => {
    const coins = parseInt(amount) || 0
    
    if (coins <= 0) {
      throw new AppError('Please enter a valid amount', 'VALIDATION_ERROR')
    }
    if (coins > kid.coins) {
      throw new AppError('Not enough coins available', 'VALIDATION_ERROR')
    }

    const updatedKid = { ...kid, coins: kid.coins - coins }
    updateKid(updatedKid)
    setAmount('')
    setAction(`${actionType}: ${coins} coins`)
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    transactions.push({
      id: Date.now().toString(),
      kidId: kid.id,
      type: actionType,
      amount: coins,
      description: `${actionType} ${coins} coins`,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('transactions', JSON.stringify(transactions))
    
    setTimeout(() => setAction(''), 3000)
  }, 'MoneyActions.handleAction')

  const handleRealMoneyAction = withErrorHandling((actionType) => {
    const money = parseFloat(realMoneyAmount) || 0
    
    if (money <= 0) {
      throw new AppError('Please enter a valid amount', 'VALIDATION_ERROR')
    }
    if (actionType === 'Spend' && money > (kid.realMoney || 0)) {
      throw new AppError('Not enough savings available', 'VALIDATION_ERROR')
    }

    let updatedKid
    if (actionType === 'Add') {
      updatedKid = { ...kid, realMoney: (kid.realMoney || 0) + money }
    } else {
      updatedKid = { ...kid, realMoney: (kid.realMoney || 0) - money }
    }
    
    updateKid(updatedKid)
    setRealMoneyAmount('')
    setAction(`${actionType}: $${money}`)
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    transactions.push({
      id: Date.now().toString(),
      kidId: kid.id,
      type: actionType,
      amount: money,
      description: actionType === 'Add' ? 'Added to savings' : 'Spent earnings',
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('transactions', JSON.stringify(transactions))
    
    setTimeout(() => setAction(''), 3000)
  }, 'MoneyActions.handleRealMoneyAction')

  return (
    <div className="card">
      <div className="nav tab-switch" style={{ marginBottom: '20px' }}>
        <button 
          className={activeTab === 'coins' ? 'active' : ''}
          onClick={() => setActiveTab('coins')}
        >
          💰 Coins
        </button>
        <button 
          className={activeTab === 'money' ? 'active' : ''}
          onClick={() => setActiveTab('money')}
        >
          💵 Earnings
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      {activeTab === 'coins' && (
        <div>
          <h3 className="mb-4">💰 What to do with your coins?</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label>Amount to use:</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={kid.coins}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginTop: '8px'
              }}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => handleAction('Saved')}
            disabled={!amount || parseInt(amount) > kid.coins}
          >
            🏦 Save for Later
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handleAction('Spent')}
            disabled={!amount || parseInt(amount) > kid.coins}
          >
            🛍️ Spend on Something Fun
          </button>
          
          <button 
            className="btn"
            style={{ background: '#FF9800', color: 'white' }}
            onClick={() => handleAction('Gave')}
            disabled={!amount || parseInt(amount) > kid.coins}
          >
            💝 Give to Help Others
          </button>
        </div>
      )}

      {activeTab === 'money' && (
        <div>
          <h3 className="mb-4">💵 Earnings Savings</h3>
          <p style={{ marginBottom: '16px', color: '#666' }}>Save money you earned from completing missions!</p>
          
          <div style={{ marginBottom: '20px' }}>
            <label>Amount ($):</label>
            <input 
              type="number"
              step="0.01"
              value={realMoneyAmount}
              onChange={(e) => setRealMoneyAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginTop: '8px'
              }}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => handleRealMoneyAction('Add')}
            disabled={!realMoneyAmount}
          >
            🏦 Add to Savings
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handleRealMoneyAction('Spend')}
            disabled={!realMoneyAmount || parseFloat(realMoneyAmount) > (kid.realMoney || 0)}
          >
            🛍️ Spend Earnings
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 className="mb-4">📜 Money History</h3>
          
          {moneyTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No money activity yet. Save, spend, or manage your earnings to see history!
            </div>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
              {moneyTransactions.slice().reverse().map(transaction => (
                <div 
                  key={transaction.id} 
                  className="slide-in"
                  style={{ 
                    background: '#f8f9fa', 
                    padding: '8px', 
                    margin: '4px 0', 
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flex: 1 }}>
                    <span style={{ fontSize: '14px', marginTop: '1px' }}>{getEmoji(transaction.type)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '12px', wordBreak: 'break-word' }}>
                        {transaction.description}
                      </div>
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '1px' }}>
                        {formatDate(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '11px',
                    color: transaction.type === 'earn' || transaction.type === 'Add' ? '#4CAF50' : '#FF9800',
                    whiteSpace: 'nowrap',
                    textAlign: 'right'
                  }}>
                    {transaction.type === 'earn' || transaction.type === 'Add' ? '+' : '-'}
                    {transaction.type === 'earn' ? `${transaction.amount} coins` : `$${transaction.amount}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {action && (
        <div className="success-message" style={{ 
          background: '#e8f5e8', 
          padding: '12px', 
          borderRadius: '8px', 
          marginTop: '16px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {action} 🎉
        </div>
      )}
    </div>
  )
}

export default MoneyActions