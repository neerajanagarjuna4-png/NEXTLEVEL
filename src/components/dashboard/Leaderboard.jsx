import { useState, useEffect } from 'react'
import axios from 'axios'
import './Leaderboard.css'

function Leaderboard({ fullView }) {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [tab, setTab] = useState('all')

  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaderboard(res.data.leaderboard || [])
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter by branch if tab is set
  const filtered = tab === 'all' ? leaderboard : leaderboard.filter(s => s.branch === tab)

  // Re-assign ranks dynamically based on the current filter
  const ranked = filtered.map((s, i) => ({ ...s, rank: i + 1 }))

  const displayList = fullView ? ranked : ranked.slice(0, 5)

  if (loading) return <div className="leaderboard-widget"><p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading Leaderboard...</p></div>

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
