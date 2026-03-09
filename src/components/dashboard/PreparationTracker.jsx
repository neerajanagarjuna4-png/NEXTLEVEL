import { useState, useEffect } from 'react'
import './PreparationTracker.css'

function PreparationTracker({ userKey }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = userKey || user.id || user.email || 'default'

  const [editMode, setEditMode] = useState(false)
  const [targets, setTargets] = useState({
    daily: user.targets?.daily || 6,
    weekly: user.targets?.weekly || 42,
    monthly: user.targets?.monthly || 180,
  })
  const [tempTargets, setTempTargets] = useState({ ...targets })

  // Calculate actual hours from study reports
  const getStudyHours = () => {
    const saved = localStorage.getItem(`studyReports_${userId}`)
    if (!saved) return { today: 0, week: 0, month: 0 }
    const reports = JSON.parse(saved)
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    // Start of week (Monday)
    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - mondayOffset)
    weekStart.setHours(0, 0, 0, 0)

    // Start of month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    let today = 0, week = 0, month = 0

    reports.forEach(r => {
      const rDate = new Date(r.date)
      const hours = Number(r.studyHours) || 0
      if (r.date === todayStr) today += hours
      if (rDate >= weekStart) week += hours
      if (rDate >= monthStart) month += hours
    })

    return { today, week, month }
  }

  const hours = getStudyHours()

  const getColor = (pct) => {
    if (pct >= 80) return '#10b981'
    if (pct >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const handleSave = () => {
    setTargets({ ...tempTargets })
    setEditMode(false)
    // Persist targets to user object
    const userObj = JSON.parse(localStorage.getItem('user') || '{}')
    userObj.targets = { ...tempTargets }
    localStorage.setItem('user', JSON.stringify(userObj))
  }

  const cards = [
    {
      icon: '🌅',
      title: 'Daily',
      current: hours.today,
      target: targets.daily,
      unit: 'hours',
      key: 'daily',
    },
    {
      icon: '📅',
      title: 'Weekly',
      current: hours.week,
      target: targets.weekly,
      unit: 'hours',
      key: 'weekly',
    },
    {
      icon: '📆',
      title: 'Monthly',
      current: hours.month,
      target: targets.monthly,
      unit: 'hours',
      key: 'monthly',
    },
  ]

  return (
    <div className="prep-tracker">
      <div className="prep-header">
        <h3>🎯 Preparation Tracker</h3>
        {!editMode ? (
          <button className="prep-edit-btn" onClick={() => { setTempTargets({ ...targets }); setEditMode(true) }}>
            ✏️ Edit Targets
          </button>
        ) : (
          <button className="prep-save-btn" onClick={handleSave}>
            💾 Save All Targets
          </button>
        )}
      </div>

      <div className="prep-cards">
        {cards.map(card => {
          const pct = card.target > 0 ? Math.min(100, Math.round((card.current / card.target) * 100)) : 0
          const barColor = getColor(pct)

          return (
            <div key={card.key} className="prep-card">
              <div className="prep-card-head">
                <span className="prep-icon">{card.icon}</span>
                <span className="prep-title">{card.title}</span>
              </div>
              <div className="prep-card-body">
                <div className="prep-progress-text">
                  <span className="prep-current">{card.current.toFixed(1)}</span>
                  <span className="prep-separator">/</span>
                  {editMode ? (
                    <input
                      type="number"
                      className="prep-target-input"
                      min="1"
                      value={tempTargets[card.key]}
                      onChange={e => setTempTargets(prev => ({ ...prev, [card.key]: Number(e.target.value) }))}
                    />
                  ) : (
                    <span className="prep-target">{card.target}</span>
                  )}
                  <span className="prep-unit">{card.unit}</span>
                </div>
                <div className="prep-progress-bar">
                  <div
                    className="prep-progress-fill"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <div className="prep-pct" style={{ color: barColor }}>{pct}% complete</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PreparationTracker
