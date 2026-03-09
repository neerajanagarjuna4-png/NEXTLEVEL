import { useState, useEffect } from 'react'
import './RewardSystem.css'

function RewardSystem() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user.id || user.email || 'default'

  // Calculate streak from study reports
  const getStreakAndBadges = () => {
    const saved = localStorage.getItem(`studyReports_${userId}`)
    if (!saved) return { streak: 0, badges: [], points: user.points || 0 }
    const reports = JSON.parse(saved)
    const points = user.points || reports.length * 60

    // Get unique dates sorted descending
    const dates = [...new Set(reports.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a))

    let streak = 0
    if (dates.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDate = new Date(dates[0])
      firstDate.setHours(0, 0, 0, 0)

      // Check if most recent report is today or yesterday
      const diffDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24))
      if (diffDays <= 1) {
        streak = 1
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          const gap = Math.floor((prev - curr) / (1000 * 60 * 60 * 24))
          if (gap === 1) {
            streak++
          } else {
            break
          }
        }
      }
    }

    // Calculate badges
    const badgeDefs = [
      { name: "Consistency Builder", icon: "🌱", desc: "7-day study streak", requirement: 7 },
      { name: "Dedicated Aspirant", icon: "⚡", desc: "14-day study streak", requirement: 14 },
      { name: "Discipline Master", icon: "👑", desc: "30-day study streak", requirement: 30 },
    ]

    const badges = badgeDefs.map(b => ({
      ...b,
      earned: streak >= b.requirement,
      progress: Math.min(100, Math.round((streak / b.requirement) * 100)),
    }))

    return { streak, badges, points }
  }

  const { streak, badges, points } = getStreakAndBadges()
  const level = Math.floor(points / 500) + 1

  return (
    <div className="reward-widget">
      <div className="reward-header">
        <h3>🏆 Achievements</h3>
        <span className="points-badge">{points.toLocaleString()} PTS</span>
      </div>

      {/* Streak & Level */}
      <div className="streak-level-row">
        <div className="streak-card">
          <span className="streak-fire">🔥</span>
          <span className="streak-num">{streak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
        <div className="level-card">
          <span className="level-star">⭐</span>
          <span className="level-num">Lv. {level}</span>
          <span className="level-label">{points} points</span>
        </div>
      </div>

      {/* Badges */}
      <div className="badges-list">
        {badges.map((badge, idx) => (
          <div key={idx} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
            <div className="badge-icon-wrap">
              <span className="badge-icon">{badge.icon}</span>
              {!badge.earned && <span className="badge-lock">🔒</span>}
            </div>
            <div className="badge-info">
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-desc">{badge.desc}</p>
              {badge.earned ? (
                <span className="badge-date">✅ Unlocked!</span>
              ) : (
                <div className="badge-progress-wrap">
                  <div className="badge-progress-bar">
                    <div className="badge-progress-fill" style={{ width: `${badge.progress}%` }} />
                  </div>
                  <span className="badge-progress-text">{streak}/{badge.requirement} days</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RewardSystem
