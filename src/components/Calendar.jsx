import { useState } from 'react'
import { getKid, getFilteredMissions } from '../utils/storage'

function Calendar({ kidId }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const kid = getKid(kidId)
  const missions = getFilteredMissions(kid?.age || 9)
  
  const today = new Date()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= lastDay || days.length < 42) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1)
    return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7)
  }

  const isToday = (date) => {
    return date.toDateString() === today.toDateString()
  }

  const getMissionsForDate = (date) => {
    const dayOfWeek = date.getDay()
    return missions.filter(mission => {
      if (mission.type === 'chore') return dayOfWeek === 0 || dayOfWeek === 6 // Weekend chores
      if (mission.type === 'math') return dayOfWeek >= 1 && dayOfWeek <= 5 // Weekday math
      return dayOfWeek % 2 === 0 // Other missions every other day
    })
  }

  const hasMissions = (date) => {
    return getMissionsForDate(date).length > 0
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="btn"
          style={{ padding: '8px 12px', margin: 0 }}
        >
          ←
        </button>
        <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <button 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="btn"
          style={{ padding: '8px 12px', margin: 0 }}
        >
          →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.slice(0, 35).map((date, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(selectedDate?.toDateString() === date.toDateString() ? null : date)}
            style={{
              padding: '8px',
              textAlign: 'center',
              backgroundColor: selectedDate?.toDateString() === date.toDateString() ? '#FF9800' : isToday(date) ? '#4CAF50' : hasMissions(date) ? '#e3f2fd' : 'transparent',
              color: selectedDate?.toDateString() === date.toDateString() || isToday(date) ? 'white' : date.getMonth() !== currentDate.getMonth() ? '#ccc' : 'black',
              borderRadius: '4px',
              fontSize: '14px',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {date.getDate()}
            {hasMissions(date) && !isToday(date) && selectedDate?.toDateString() !== date.toDateString() && (
              <div style={{ fontSize: '10px', color: '#2196F3' }}>⭐</div>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4>📅 {selectedDate.toLocaleDateString()}</h4>
          {getMissionsForDate(selectedDate).length > 0 ? (
            <div>
              <p style={{ margin: '8px 0', fontWeight: 'bold' }}>Missions for this day:</p>
              {getMissionsForDate(selectedDate).map(mission => (
                <div key={mission.id} style={{ 
                  background: 'white', 
                  padding: '8px', 
                  margin: '4px 0', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  {mission.title} - 💰 {mission.reward} coins
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', margin: '8px 0' }}>No missions scheduled for this day</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        <div>📅 Current Week: {getWeekNumber(today)}</div>
        <div>🎯 Click any day to see missions</div>
      </div>
    </div>
  )
}

export default Calendar