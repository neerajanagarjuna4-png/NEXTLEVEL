import { useState, useEffect } from 'react'
import axios from 'axios'
import './RewardSystem.css'

function RewardSystem() {
  const [rewards, setRewards] = useState({})
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (user._id && token) fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const res = await axios.get(`/api/student/rewards/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRewards(res.data)
    } catch (err) {
      console.error('Failed to fetch rewards:', err)
    } finally {
      setLoading(false)
    }
  }

  const { streak = 0, badges = [], consistencyScore = 0, nextMilestone, daysToNextMilestone } = rewards

  if (loading) return <div className="reward-system"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p></div>

  return (
    <div className="reward-system">
      <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px' }}>🏆 Rewards & Achievements</h3>

      {/* Streak Display */}
      <div className="streak-display">
        <div className="streak-flame">🔥</div>
        <div className="streak-info">
          <div className="streak-count">{streak} Day Streak</div>
          <div className="streak-subtext">
            {nextMilestone 
              ? `${daysToNextMilestone} days to next badge (${nextMilestone}-day milestone)`
              : 'All milestones achieved! 🎉'
            }
          </div>
        </div>
      </div>

      {/* Consistency Score */}
      <div className="consistency-card" style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>📊 Consistency Score</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: consistencyScore >= 70 ? '#10b981' : consistencyScore >= 40 ? '#f59e0b' : '#ef4444' }}>
            {consistencyScore}%
          </span>
        </div>
        <div className="hours-bar" style={{ marginTop: '6px' }}>
          <div className="hours-fill" style={{ 
            width: `${consistencyScore}%`,
            background: consistencyScore >= 70 ? '#10b981' : consistencyScore >= 40 ? '#f59e0b' : '#ef4444'
          }} />
        </div>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
          Based on last 7 days' target adherence
        </p>
      </div>

      {/* Earned Badges */}
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>🎖️ Earned Badges</h4>
        {badges.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>
            Keep submitting reports and completing tasks to earn badges!
          </p>
        ) : (
          <div className="badge-grid">
            {badges.map((badge, i) => (
              <div key={i} className="badge-card earned">
                <span className="badge-icon">{badge.name.split(' ')[0]}</span>
                <span className="badge-name">{badge.name.split(' ').slice(1).join(' ')}</span>
                <span className="badge-date">
                  {new Date(badge.earnedDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestone tracker */}
      <div style={{ marginTop: '12px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>🎯 Milestones</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { days: 7, label: '7-Day Warrior' },
            { days: 14, label: '14-Day Champion' },
            { days: 30, label: '30-Day Legend' },
            { days: 60, label: '60-Day Diamond' },
            { days: 100, label: '100-Day Master' }
          ].map(m => (
            <div key={m.days} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
              background: streak >= m.days ? '#dcfce7' : '#f1f5f9',
              color: streak >= m.days ? '#16a34a' : '#94a3b8',
              border: `1px solid ${streak >= m.days ? '#86efac' : '#e2e8f0'}`
            }}>
              {streak >= m.days ? '✅' : '⬜'} {m.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RewardSystem
