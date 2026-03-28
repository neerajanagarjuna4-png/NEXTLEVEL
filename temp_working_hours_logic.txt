import { useState, useEffect } from 'react'
import axios from 'axios'
import './WorkingHoursTracker.css'

function WorkingHoursTracker() {
  const [progress, setProgress] = useState({ today: {}, week: {}, month: {}, targets: {} })
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (user._id && token) fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`/api/student/progress/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProgress(res.data.progress || {})
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const { today, week, month, targets } = progress
  const todayHours = today?.studyHours || 0
  const weekHours = week?.studyHours || 0
  const monthHours = month?.studyHours || 0
  const dailyTarget = targets?.daily || 6
  const weeklyTarget = targets?.weekly || 42
  const monthlyTarget = targets?.monthly || 180

  const getProgressColor = (actual, target) => {
    const ratio = target > 0 ? actual / target : 0
    if (ratio >= 1) return '#10b981'
    if (ratio >= 0.6) return '#f59e0b'
    return '#ef4444'
  }

  if (loading) return <div className="working-hours"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p></div>

  return (
    <div className="working-hours">
      <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px' }}>⏱️ Working Hours</h3>
      
      {/* Today */}
      <div className="hours-card">
        <div className="hours-header">
          <span className="hours-label">📅 Today</span>
          <span className="hours-value" style={{ color: getProgressColor(todayHours, dailyTarget) }}>
            {todayHours.toFixed(1)}h / {dailyTarget}h
          </span>
        </div>
        <div className="hours-bar">
          <div className="hours-fill" style={{ 
            width: `${Math.min((todayHours / dailyTarget) * 100, 100)}%`,
            background: getProgressColor(todayHours, dailyTarget)
          }} />
        </div>
      </div>

      {/* This Week */}
      <div className="hours-card">
        <div className="hours-header">
          <span className="hours-label">📊 This Week</span>
          <span className="hours-value" style={{ color: getProgressColor(weekHours, weeklyTarget) }}>
            {weekHours.toFixed(1)}h / {weeklyTarget}h
          </span>
        </div>
        <div className="hours-bar">
          <div className="hours-fill" style={{ 
            width: `${Math.min((weekHours / weeklyTarget) * 100, 100)}%`,
            background: getProgressColor(weekHours, weeklyTarget)
          }} />
        </div>
      </div>

      {/* This Month */}
      <div className="hours-card">
        <div className="hours-header">
          <span className="hours-label">📈 This Month</span>
          <span className="hours-value" style={{ color: getProgressColor(monthHours, monthlyTarget) }}>
            {monthHours.toFixed(1)}h / {monthlyTarget}h
          </span>
        </div>
        <div className="hours-bar">
          <div className="hours-fill" style={{ 
            width: `${Math.min((monthHours / monthlyTarget) * 100, 100)}%`,
            background: getProgressColor(monthHours, monthlyTarget)
          }} />
        </div>
      </div>

      {/* PYQs solved stats */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <div style={{ flex: 1, background: '#f0fdf4', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Today PYQs</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{today?.pyqsSolved || 0}</div>
        </div>
        <div style={{ flex: 1, background: '#eff6ff', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Week PYQs</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3b82f6' }}>{week?.pyqsSolved || 0}</div>
        </div>
        <div style={{ flex: 1, background: '#fef3c7', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Accuracy</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b' }}>{today?.accuracy || 0}%</div>
        </div>
      </div>
    </div>
  )
}

export default WorkingHoursTracker
