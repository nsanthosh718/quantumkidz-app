import { getAdvancedAnalytics } from '../utils/aiEngine'
import { getKidTransactions } from '../utils/storage'

function AIInsights({ kid }) {
  if (!kid || !kid.id) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🤖 AI Insights</h3>
        <p>Please select a kid profile to view AI insights.</p>
      </div>
    )
  }

  let transactions, analytics
  try {
    transactions = getKidTransactions(kid.id) || []
    analytics = getAdvancedAnalytics(kid, transactions)
  } catch (error) {
    console.error('Error loading AI insights:', error)
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🤖 AI Insights for {kid.name}</h3>
        <p>Unable to load insights at this time. Please try again later.</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="card slide-in">
        <h3 className="mb-4">🤖 AI Insights for {kid.name}</h3>
        <p>Loading insights...</p>
      </div>
    )
  }

  return (
    <div className="card slide-in">
      <h3 className="mb-4">🤖 AI Insights for {kid.name || 'Child'}</h3>
      
      {/* Performance Overview */}
      <div style={{ background: '#f0f8ff', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
        <h4>📊 Performance Analysis</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              {Math.round(analytics.completionRate * 100)}%
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Mission Success</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
              {analytics.financialPersonality === 'saver' ? '🏦' : '🛍️'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {analytics.financialPersonality.charAt(0).toUpperCase() + analytics.financialPersonality.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ marginBottom: '16px' }}>
        <h4>💡 Smart Insights</h4>
        {(analytics.insights || []).map((insight, index) => (
          <div key={index} style={{ 
            background: '#fff3e0', 
            padding: '8px 12px', 
            margin: '4px 0', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {insight || 'No insight available'}
          </div>
        ))}
      </div>

      {/* Projections */}
      <div style={{ marginBottom: '16px' }}>
        <h4>🔮 Future Projections</h4>
        <div style={{ background: '#e8f5e8', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
            📈 Weekly earning potential: <strong>{(analytics.projections?.weeklyEarningPotential || 0)} coins</strong>
          </div>
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
            📊 Growth rate: <strong>{Math.round(analytics.projections?.monthlyGrowthRate || 0)}%</strong>
          </div>
          <div style={{ fontSize: '14px' }}>
            🎯 Focus areas: <strong>{(analytics.projections?.skillDevelopmentAreas || []).join(', ') || 'None identified'}</strong>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4>🎯 AI Recommendations</h4>
        {(analytics.recommendations || []).map((rec, index) => (
          <div key={index} style={{ 
            background: '#f3e5f5', 
            padding: '8px 12px', 
            margin: '4px 0', 
            borderRadius: '8px',
            fontSize: '13px',
            borderLeft: '3px solid #9C27B0'
          }}>
            {rec || 'No recommendation available'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIInsights