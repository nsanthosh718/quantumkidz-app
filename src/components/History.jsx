import { getKidTransactions } from '../utils/storage'

function History({ kidId }) {
  const transactions = getKidTransactions(kidId)
  
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

  return (
    <div className="card">
      <h3 className="mb-4">📜 Your History</h3>
      
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          No activity yet. Complete some missions to see your history!
        </div>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
          {transactions.slice().reverse().map(transaction => (
            <div 
              key={transaction.id} 
              className="slide-in"
              style={{ 
                background: '#f8f9fa', 
                padding: '10px', 
                margin: '6px 0', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>{getEmoji(transaction.type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word' }}>
                    {transaction.description}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '12px',
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
  )
}

export default History