function BalanceDisplay({ kid }) {
  if (!kid) {
    return (
      <div className="balance">
        <div style={{ color: '#666', textAlign: 'center' }}>Loading balance...</div>
      </div>
    )
  }

  const coins = kid.coins || 0
  const realMoney = kid.realMoney || 0
  const completedMissions = kid.completedMissions?.length || 0

  return (
    <div className="balance">
      <div>
        <div style={{ fontSize: '24px' }}>💰</div>
        <div>{coins} coins</div>
      </div>
      <div>
        <div style={{ fontSize: '24px' }}>💵</div>
        <div>${realMoney}</div>
      </div>
      <div>
        <div style={{ fontSize: '24px' }}>🏆</div>
        <div>{completedMissions} missions</div>
      </div>
    </div>
  )
}

export default BalanceDisplay