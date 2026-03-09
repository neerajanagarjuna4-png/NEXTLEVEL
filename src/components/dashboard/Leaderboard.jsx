import { useState, useEffect } from 'react'
import './Leaderboard.css'

function Leaderboard({ fullView }) {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [tab, setTab] = useState('all')

  // Get all real registered students from localStorage
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
  const approvedStudents = allUsers.filter(s => s.status === 'approved')

  // Enrich with points/streak data from their reports
  const enriched = approvedStudents.map(s => {
    const reports = JSON.parse(localStorage.getItem(`studyReports_${s.id}`) || '[]')
    const points = s.points || reports.length * 60

    // Calculate streak
    const dates = [...new Set(reports.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a))
    let streak = 0
    if (dates.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDate = new Date(dates[0])
      firstDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24))
      if (diffDays <= 1) {
        streak = 1
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          const gap = Math.floor((prev - curr) / (1000 * 60 * 60 * 24))
          if (gap === 1) streak++
          else break
        }
      }
    }

    const totalHours = reports.reduce((sum, r) => sum + (Number(r.studyHours) || 0), 0)

    return {
      ...s,
      points,
      streak,
      totalHours,
      reportCount: reports.length,
    }
  })

  // Sort by points descending
  const sorted = [...enriched].sort((a, b) => b.points - a.points)

  // Filter by branch if tab is set
  const filtered = tab === 'all' ? sorted : sorted.filter(s => s.branch === tab)

  // Assign ranks
  const ranked = filtered.map((s, i) => ({ ...s, rank: i + 1 }))

  const displayList = fullView ? ranked : ranked.slice(0, 5)

  const podiumIcons = ['🥇', '🥈', '🥉']

  return (
    <div className={`leaderboard-widget ${fullView ? 'full' : ''}`}>
      <div className="lb-header">
        <h3>🥇 Top Aspirants</h3>
        <div className="lb-tabs">
          {['all', 'ECE', 'EE', 'CSE'].map(t => (
            <button
              key={t}
              className={`lb-tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {displayList.length === 0 && (
        <div className="lb-empty">
          <p>No students registered yet. Be the first to climb the ranks!</p>
        </div>
      )}

      <div className="lb-list">
        {displayList.map(student => {
          const isMe = student.email === currentUser.email
          return (
            <div key={student.id} className={`lb-item ${isMe ? 'is-me' : ''} ${student.rank <= 3 ? `rank-${student.rank}` : ''}`}>
              <div className="lb-rank">
                {student.rank <= 3 ? podiumIcons[student.rank - 1] : `#${student.rank}`}
              </div>
              <div className="lb-info">
                <div className="lb-name">
                  {student.name} {isMe && <span className="lb-you-tag">YOU</span>}
                </div>
                <div className="lb-details">
                  <span className="lb-branch">{student.branch}</span> •
                  <span className="lb-points"> {student.points.toLocaleString()} PTS</span> •
                  <span className="lb-hours"> {student.totalHours.toFixed(1)}h studied</span>
                </div>
              </div>
              <div className="lb-streak">🔥 {student.streak}</div>
            </div>
          )
        })}
      </div>

      {!fullView && ranked.length > 5 && (
        <button className="lb-view-all">View Full Leaderboard</button>
      )}
    </div>
  )
}

export default Leaderboard
