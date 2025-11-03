import { Link } from 'react-router-dom'

function AppBanner() {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <div className="app-banner" style={{ cursor: 'pointer' }}>
        <h1 className="app-title">⚡ QuantumKidz</h1>
        <p className="app-subtitle">AI-Powered Financial Evolution for Digital Natives</p>
      </div>
    </Link>
  )
}

export default AppBanner