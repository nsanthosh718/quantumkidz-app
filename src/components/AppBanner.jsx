import { Link } from 'react-router-dom'

function AppBanner() {
  return (
    <Link to="/" style={{ 
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      textDecoration: 'none',
      background: '#4CAF50',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      🏠
    </Link>
  )
}

export default AppBanner