import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSyllabus } from '../data/syllabus.js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './MentorDashboard.css'

function MentorDashboard() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'mentor') navigate('/login')
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setStudents(allUsers)

    // Check for email action URL params
    const searchParams = new URLSearchParams(window.location.search)
    const action = searchParams.get('action')
    const targetEmail = searchParams.get('email')

    if (action && targetEmail) {
      const targetUser = allUsers.find(u => u.email === targetEmail)
      if (targetUser && targetUser.status === 'pending') {
        const updated = allUsers.map(s => {
          if (s.id === targetUser.id) {
             return { 
               ...s, 
               status: action === 'approve' ? 'approved' : 'rejected',
               approvedAt: action === 'approve' ? new Date().toISOString() : undefined
             }
          }
          return s
        })
        setStudents(updated)
        localStorage.setItem('users', JSON.stringify(updated))
        
        // Remove query params from URL so it doesn't run again on refresh
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [navigate])

  const handleApprove = (id) => {
    const updated = students.map(s => s.id === id ? { ...s, status: 'approved', approvedAt: new Date().toISOString() } : s)
    setStudents(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const handleReject = (id) => {
    const updated = students.map(s => s.id === id ? { ...s, status: 'rejected' } : s)
    setStudents(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  // Get full student data
  const getStudentFullData = (student) => {
    const reports = JSON.parse(localStorage.getItem(`studyReports_${student.id}`) || '[]')
    const sortedReports = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date))

    // Total study hours
    const totalHours = reports.reduce((sum, r) => sum + (Number(r.studyHours) || 0), 0)
    const totalPYQs = reports.reduce((sum, r) => sum + (Number(r.pyqsSolved) || 0), 0)
    const avgAccuracy = reports.length > 0
      ? Math.round(reports.filter(r => r.accuracy).reduce((sum, r) => sum + Number(r.accuracy), 0) / Math.max(1, reports.filter(r => r.accuracy).length))
      : 0

    // Streak
    const dates = [...new Set(reports.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a))
    let streak = 0
    if (dates.length > 0) {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const firstDate = new Date(dates[0]); firstDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24))
      if (diffDays <= 1) {
        streak = 1
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          if (Math.floor((prev - curr) / (1000 * 60 * 60 * 24)) === 1) streak++
          else break
        }
      }
    }

    // Syllabus progress
    const savedProgress = localStorage.getItem(`syllabusProgress_${student.branch}`)
    let syllabusCompleted = 0, syllabusTotal = 0
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      syllabusCompleted = Object.values(progress).filter(v => v === true).length
    }
    const syllabus = getSyllabus(student.branch)
    syllabus.forEach(section => section.subjects.forEach(s => syllabusTotal += s.topics.length))
    const syllabusPct = syllabusTotal > 0 ? Math.round((syllabusCompleted / syllabusTotal) * 100) : 0

    // Days since last report
    let daysSinceReport = null
    if (dates.length > 0) {
      daysSinceReport = Math.floor((Date.now() - new Date(dates[0])) / (1000 * 60 * 60 * 24))
    }

    // Targets
    const targets = student.targets || { daily: 6, weekly: 42, monthly: 180 }

    // Points & level
    const points = student.points || reports.length * 60
    const level = Math.floor(points / 500) + 1

    // Badges
    const badgeDefs = [
      { name: "Consistency Builder 🌱", requirement: 7 },
      { name: "Dedicated Aspirant ⚡", requirement: 14 },
      { name: "Discipline Master 👑", requirement: 30 },
    ]
    const badges = badgeDefs.filter(b => streak >= b.requirement).map(b => b.name)

    // Mood distribution
    const moodMap = {}
    reports.forEach(r => { if (r.mood) moodMap[r.mood] = (moodMap[r.mood] || 0) + 1 })

    return {
      ...student,
      reports: sortedReports,
      totalHours,
      totalPYQs,
      avgAccuracy,
      streak,
      syllabusCompleted,
      syllabusTotal,
      syllabusPct,
      daysSinceReport,
      targets,
      points,
      level,
      badges,
      moodMap,
      reportCount: reports.length,
    }
  }

  // At-Risk Detection
  const getAtRiskStudents = () => {
    const approved = students.filter(s => s.status === 'approved')
    return approved.filter(s => {
      const reports = JSON.parse(localStorage.getItem(`studyReports_${s.id}`) || '[]')
      if (reports.length === 0) return true
      const dates = reports.map(r => new Date(r.date)).sort((a, b) => b - a)
      const daysSince = Math.floor((Date.now() - dates[0]) / (1000 * 60 * 60 * 24))
      return daysSince >= 3
    })
  }

  const pending = students.filter(s => s.status === 'pending')
  const approved = students.filter(s => s.status === 'approved')
  const atRisk = getAtRiskStudents()

  const filtered = students
    .filter(s => filter === 'all' || s.branch === filter)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))

  const MOODS = { great: '😊', good: '😌', neutral: '😐', tired: '😴', stressed: '😰' }

  // Student Detail Modal
  const renderStudentDetail = () => {
    if (!selectedStudent) return null
    const data = getStudentFullData(selectedStudent)

    return (
      <div className="student-modal-overlay" onClick={() => setSelectedStudent(null)}>
        <div className="student-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2>{data.name}</h2>
              <p className="modal-subtitle">{data.email} • {data.branch} • Level {data.level}</p>
            </div>
            <button className="modal-close" onClick={() => setSelectedStudent(null)}>✕</button>
          </div>

          {/* Stats Grid */}
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="ms-num">{data.totalHours.toFixed(1)}h</span>
              <span className="ms-label">Total Study Hours</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{data.totalPYQs}</span>
              <span className="ms-label">PYQs Solved</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{data.avgAccuracy}%</span>
              <span className="ms-label">Avg Accuracy</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">🔥 {data.streak}</span>
              <span className="ms-label">Day Streak</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{data.points}</span>
              <span className="ms-label">Points</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{data.reportCount}</span>
              <span className="ms-label">Reports Submitted</span>
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="modal-section">
            <h3>📚 Syllabus Progress</h3>
            <div className="modal-progress-bar">
              <div className="modal-progress-fill" style={{
                width: `${data.syllabusPct}%`,
                background: data.syllabusPct >= 80 ? '#10b981' : data.syllabusPct >= 50 ? '#f59e0b' : '#ef4444'
              }} />
            </div>
            <p className="modal-progress-text">{data.syllabusCompleted}/{data.syllabusTotal} topics ({data.syllabusPct}%)</p>
          </div>

          {/* Preparation Targets */}
          <div className="modal-section">
            <h3>🎯 Study Targets</h3>
            <div className="modal-targets">
              <span>Daily: {data.targets.daily}h</span>
              <span>Weekly: {data.targets.weekly}h</span>
              <span>Monthly: {data.targets.monthly}h</span>
            </div>
          </div>

          {/* Badges */}
          <div className="modal-section">
            <h3>🏆 Badges Earned</h3>
            {data.badges.length > 0 ? (
              <div className="modal-badges">
                {data.badges.map((b, i) => <span key={i} className="modal-badge">{b}</span>)}
              </div>
            ) : (
              <p className="modal-muted">No badges earned yet.</p>
            )}
          </div>

          {/* Mood Distribution */}
          {Object.keys(data.moodMap).length > 0 && (
            <div className="modal-section">
              <h3>🧠 Mood Distribution</h3>
              <div className="modal-moods">
                {Object.entries(data.moodMap).map(([mood, count]) => (
                  <span key={mood} className="modal-mood-item">
                    {MOODS[mood] || '😐'} {mood}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity Status */}
          <div className="modal-section">
            <h3>📅 Activity</h3>
            <p>Registered: {new Date(data.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            {data.approvedAt && <p>Approved: {new Date(data.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
            <p>Last Report: {data.daysSinceReport !== null ? (data.daysSinceReport === 0 ? 'Today' : `${data.daysSinceReport} day(s) ago`) : 'No reports yet'}</p>
          </div>

          {/* Consistency Graph */}
          {data.reports.length > 0 && (
            <div className="modal-section">
              <h3>📈 Consistency Graph</h3>
              <p className="modal-subtitle" style={{ marginBottom: '16px' }}>Study hours over recorded days</p>
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...data.reports].reverse().map(r => ({
                      date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                      hours: r.studyHours
                    }))}
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="#cbd5e1" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                    <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}
                      labelStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}
                    />
                    <Line type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Reports */}
          <div className="modal-section">
            <h3>📋 Recent Study Reports ({data.reportCount})</h3>
            {data.reports.length === 0 && <p className="modal-muted">No reports submitted yet.</p>}
            <div className="modal-reports">
              {data.reports.slice(0, 10).map((r, i) => (
                <div key={i} className="modal-report-row">
                  <div className="mr-date">
                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="mr-details">
                    <span>⏱️ {r.studyHours}h</span>
                    <span>📝 {r.pyqsSolved || 0} PYQs</span>
                    {r.accuracy && <span>🎯 {r.accuracy}%</span>}
                    {r.mockTestScore && <span>📊 {r.mockTestScore}/100</span>}
                    <span>{MOODS[r.mood] || '😐'}</span>
                  </div>
                  {r.subjects?.length > 0 && (
                    <div className="mr-subjects">
                      {r.subjects.map((s, j) => <span key={j} className="mr-subject-tag">{s}</span>)}
                    </div>
                  )}
                  {r.topics && <div className="mr-topics">📖 {r.topics}</div>}
                  {r.difficulties && <div className="mr-diff">😕 {r.difficulties}</div>}
                  {r.tomorrowPlan && <div className="mr-plan">📋 {r.tomorrowPlan}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mentor-dash">
      <header className="mentor-dash-header">
        <div>
          <h1>Mentor Dashboard</h1>
          <p>Welcome, Bhima Sankar Sir</p>
        </div>
        <button className="btn-outline" onClick={() => { localStorage.removeItem('user'); navigate('/login') }}>Logout</button>
      </header>

      {/* Stats */}
      <div className="mentor-stats-row">
        <div className="mentor-stat-card">
          <span className="m-stat-num">{pending.length}</span>
          <span className="m-stat-label">Pending Approvals</span>
        </div>
        <div className="mentor-stat-card">
          <span className="m-stat-num">{approved.length}</span>
          <span className="m-stat-label">Approved Students</span>
        </div>
        <div className="mentor-stat-card">
          <span className="m-stat-num">{students.filter(s => s.branch === 'ECE').length}</span>
          <span className="m-stat-label">ECE Students</span>
        </div>
        <div className="mentor-stat-card">
          <span className="m-stat-num">{students.filter(s => s.branch === 'EE').length}</span>
          <span className="m-stat-label">EE Students</span>
        </div>
        <div className="mentor-stat-card">
          <span className="m-stat-num">{students.filter(s => s.branch === 'CSE').length}</span>
          <span className="m-stat-label">CSE Students</span>
        </div>
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="card mentor-section">
          <h2>⏳ Pending Student Requests ({pending.length})</h2>
          <div className="students-list">
            {pending.map(s => (
              <div key={s.id} className="student-row pending-row">
                <div className="student-info">
                  <strong>{s.name}</strong>
                  <span>{s.email}</span>
                  <span className="branch-tag">{s.branch}</span>
                  <span className="date">{new Date(s.registeredAt).toLocaleDateString()}</span>
                </div>
                <div className="student-actions">
                  <button className="approve-btn" onClick={() => handleApprove(s.id)}>✓ Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(s.id)}>✕ Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* At-Risk Students */}
      {atRisk.length > 0 && (
        <div className="card mentor-section at-risk-section">
          <h2>⚠️ At-Risk Students ({atRisk.length})</h2>
          <p className="at-risk-note">Students who haven't submitted a report in 3+ days or have no reports.</p>
          <div className="students-list">
            {atRisk.map(s => (
              <div key={s.id} className="student-row at-risk-row clickable" onClick={() => setSelectedStudent(s)}>
                <div className="student-info">
                  <strong>{s.name}</strong>
                  <span>{s.email}</span>
                  <span className="branch-tag">{s.branch}</span>
                </div>
                <span className="at-risk-badge">Needs Attention</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Students */}
      <div className="card mentor-section">
        <div className="section-header">
          <h2>👥 All Students ({filtered.length})</h2>
          <div className="filter-row">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {['all', 'ECE', 'EE', 'CSE'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
        <p className="click-hint">💡 Click any student to view their full progress</p>
        <div className="students-list">
          {filtered.length === 0 && <p className="empty-text">No students found.</p>}
          {filtered.map(s => (
            <div key={s.id} className="student-row clickable" onClick={() => setSelectedStudent(s)}>
              <div className="student-info">
                <strong>{s.name}</strong>
                <span>{s.email}</span>
                <span className="branch-tag">{s.branch}</span>
                <span className={`status-tag ${s.status}`}>{s.status}</span>
              </div>
              <span className="view-detail-btn">View Progress →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Detail Modal */}
      {renderStudentDetail()}
    </div>
  )
}

export default MentorDashboard
