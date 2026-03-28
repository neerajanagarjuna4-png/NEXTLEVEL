import { useState, useEffect } from 'react'
import axios from 'axios'
import './Leaderboard.css'

function Leaderboard({ fullView }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
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

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const display = fullView ? leaderboard : leaderboard.slice(0, 5)

  if (loading) return <div className="leaderboard"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p></div>

  return (
    <div className="leaderboard">
      <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px' }}>🥇 Leaderboard</h3>
      
      {leaderboard.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
          No entries yet. Complete mock tests to appear on the leaderboard!
        </p>
      ) : (
        <div className="leaderboard-list">
          {display.map((entry, i) => (
            <div key={i} className={`leaderboard-item ${entry.name === currentUser.name ? 'current-user' : ''}`}>
              <div className="rank">{getRankEmoji(entry.rank)}</div>
              <div className="player-info">
                <div className="player-name">{entry.name}</div>
                <div className="player-branch">{entry.branch} • 🔥 {entry.streak} streak</div>
              </div>
              <div className="player-score">
                <div className="score-value">{entry.totalMockScore}</div>
                <div className="score-label">Total Score</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!fullView && leaderboard.length > 5 && (
        <p style={{ textAlign: 'center', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700, marginTop: '12px', cursor: 'pointer' }}>
          View full leaderboard →
        </p>
      )}
    </div>
  )
}

export default Leaderboard
