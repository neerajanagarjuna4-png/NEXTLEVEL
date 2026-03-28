import { useState, useEffect } from 'react'
import axios from 'axios'
import './RewardSystem.css'

function RewardSystem({ userKey }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = userKey || user.id || user.email || 'default'

  const token = localStorage.getItem('token')
  const [data, setData] = useState({ streak: 0, badges: [], points: user.points || 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUserId !== 'default' && token) fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const res = await axios.get(`/api/student/rewards/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const apiStreak = res.data.streak || 0
      
      const badgeDefs = [
        { name: "Consistency Builder", icon: "🌱", desc: "7-day study streak", requirement: 7 },
        { name: "Dedicated Aspirant", icon: "⚡", desc: "14-day study streak", requirement: 14 },
        { name: "Discipline Master", icon: "👑", desc: "30-day study streak", requirement: 30 },
      ]

      const formattedBadges = badgeDefs.map(b => ({
        ...b,
        earned: apiStreak >= b.requirement,
        progress: Math.min(100, Math.round((apiStreak / b.requirement) * 100)),
      }))

      setData({ streak: apiStreak, badges: formattedBadges, points: user.points || 0 })
    } catch (err) {
      console.error('Failed to fetch rewards:', err)
    } finally {
      setLoading(false)
    }
  }

  const { streak, badges, points } = data
  const level = Math.floor(points / 500) + 1

  if (loading) return <div className="reward-widget glass"><p style={{ textAlign: 'center', padding: '2rem' }}>Loading rewards...</p></div>

  return (
    <div className="reward-widget glass animate-fade-in">
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
