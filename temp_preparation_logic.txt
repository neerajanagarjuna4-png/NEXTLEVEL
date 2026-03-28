import { useState, useEffect } from 'react'
import axios from 'axios'
import './PreparationTracker.css'

function PreparationTracker() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const [progress, setProgress] = useState({ today: {}, week: {}, month: {}, targets: {} })
  const [targets, setTargets] = useState({ daily: 6, weekly: 42, monthly: 180 })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user._id && token) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const [progRes, targetRes] = await Promise.all([
        axios.get(`/api/student/progress/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/student/targets/${user._id}`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProgress(progRes.data.progress || {})
      setTargets(targetRes.data.targets || { daily: 6, weekly: 42, monthly: 180 })
    } catch (err) {
      console.error('Failed to fetch tracker data:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveTargets = async () => {
    try {
      await axios.post(`/api/student/targets/${user._id}`, targets, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEditing(false)
    } catch (err) {
      console.error('Failed to save targets:', err)
    }
  }

  const todayHours = progress.today?.studyHours || 0
  const weekHours = progress.week?.studyHours || 0
  const monthHours = progress.month?.studyHours || 0

  const getPercent = (actual, target) => target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0
  const getColor = (pct) => pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

  if (loading) return <div className="prep-tracker"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading tracker...</p></div>

  return (
    <div className="prep-tracker">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>🎯 Study Target Tracker</h3>
        <button onClick={() => editing ? saveTargets() : setEditing(true)}
          style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
            background: editing ? '#10b981' : '#3b82f6', color: '#fff'
          }}>
          {editing ? '💾 Save' : '✏️ Edit Targets'}
        </button>
      </div>

      {editing && (
        <div className="target-inputs" style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Daily (hrs)</label>
            <input type="number" min="0" max="24" value={targets.daily} 
              onChange={e => setTargets({ ...targets, daily: Number(e.target.value) })}
              style={{ width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Weekly (hrs)</label>
            <input type="number" min="0" value={targets.weekly}
              onChange={e => setTargets({ ...targets, weekly: Number(e.target.value) })}
              style={{ width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Monthly (hrs)</label>
            <input type="number" min="0" value={targets.monthly}
              onChange={e => setTargets({ ...targets, monthly: Number(e.target.value) })}
              style={{ width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>
        </div>
      )}

      {/* Progress Cards */}
      <div className="tracker-grid" style={{ marginTop: '16px' }}>
        {[
          { label: 'Today', actual: todayHours, target: targets.daily, icon: '📅' },
          { label: 'This Week', actual: weekHours, target: targets.weekly, icon: '📊' },
          { label: 'This Month', actual: monthHours, target: targets.monthly, icon: '📈' }
        ].map(item => {
          const pct = getPercent(item.actual, item.target)
          return (
            <div key={item.label} className="tracker-card" style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.icon} {item.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: getColor(pct) }}>{pct}%</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: getColor(pct), margin: '6px 0' }}>
                {item.actual.toFixed(1)}h <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>/ {item.target}h</span>
              </div>
              <div className="hours-bar">
                <div className="hours-fill" style={{ width: `${pct}%`, background: getColor(pct) }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PreparationTracker
