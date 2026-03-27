import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getSyllabus } from '../data/syllabus.js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './MentorDashboard.css'

function MentorDashboard() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudentData, setSelectedStudentData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'mentor') navigate('/login')
    fetchStudents()
  }, [navigate])

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/mentor/students', getAuthHeaders())
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
      // Fallback to localStorage for backward compatibility
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
      setStudents(allUsers.filter(u => u.role !== 'mentor'))
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/mentor/students/${id}/approve`, {}, getAuthHeaders())
      setStudents(prev => prev.map(s => s._id === id ? { ...s, status: 'approved' } : s))
    } catch (error) {
      console.error('Approve error:', error)
      // Fallback
      setStudents(prev => prev.map(s => (s._id === id || s.id === id) ? { ...s, status: 'approved' } : s))
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/mentor/students/${id}/reject`, {}, getAuthHeaders())
      setStudents(prev => prev.map(s => s._id === id ? { ...s, status: 'rejected' } : s))
    } catch (error) {
      console.error('Reject error:', error)
      setStudents(prev => prev.map(s => (s._id === id || s.id === id) ? { ...s, status: 'rejected' } : s))
    }
  }

  const handleStudentClick = async (student) => {
    setSelectedStudent(student)
    try {
      const id = student._id || student.id
      const [reportsRes, metricsRes] = await Promise.all([
        axios.get(`/api/mentor/student/${id}/reports`, getAuthHeaders()),
        axios.get(`/api/student/metrics/${id}`, getAuthHeaders())
      ])
      setSelectedStudentData({
        reports: reportsRes.data,
        metrics: metricsRes.data
      })
    } catch (error) {
      console.error('Error fetching student data:', error)
      setSelectedStudentData({ reports: [], metrics: {} })
    }
  }

  // Student Detail Modal
  const renderStudentDetail = () => {
    if (!selectedStudent) return null
    const s = selectedStudent
    const data = selectedStudentData || { reports: [], metrics: {} }
    const reports = data.reports || []
    const metrics = data.metrics || {}

    const totalHours = reports.reduce((sum, r) => sum + (Number(r.studyHours) || 0), 0)
    const totalPYQs = reports.reduce((sum, r) => sum + (Number(r.pyqsSolved) || 0), 0)
    const avgAccuracy = reports.length > 0
      ? Math.round(reports.filter(r => r.accuracy).reduce((sum, r) => sum + Number(r.accuracy), 0) / Math.max(1, reports.filter(r => r.accuracy).length))
      : 0

    const streak = metrics.streak || s.streak || 0
    const badges = metrics.badges || s.badges || []

    return (
      <div className="student-modal-overlay" onClick={() => { setSelectedStudent(null); setSelectedStudentData(null) }}>
        <div className="student-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2>{s.name}</h2>
              <p className="modal-subtitle">{s.email} • {s.branch}</p>
            </div>
            <button className="modal-close" onClick={() => { setSelectedStudent(null); setSelectedStudentData(null) }}>✕</button>
          </div>

          {/* Stats Grid */}
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="ms-num">{totalHours.toFixed(1)}h</span>
              <span className="ms-label">Total Study Hours</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{totalPYQs}</span>
              <span className="ms-label">PYQs Solved</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{avgAccuracy}%</span>
              <span className="ms-label">Avg Accuracy</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">🔥 {streak}</span>
              <span className="ms-label">Day Streak</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{metrics.consistencyScore || 0}%</span>
              <span className="ms-label">Consistency</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num">{reports.length}</span>
              <span className="ms-label">Reports</span>
            </div>
          </div>

          {/* Badges */}
          <div className="modal-section">
            <h3>🏆 Badges Earned</h3>
            {badges.length > 0 ? (
              <div className="modal-badges">
                {badges.map((b, i) => <span key={i} className="modal-badge">{b.name || b}</span>)}
              </div>
            ) : (
              <p className="modal-muted">No badges earned yet.</p>
            )}
          </div>

          {/* Consistency Graph */}
          {reports.length > 0 && (
            <div className="modal-section">
              <h3>📈 Consistency Graph</h3>
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...reports].reverse().map(r => ({
                      date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                      hours: r.studyHours
                    }))}
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} stroke="#cbd5e1" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                    <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
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
            <h3>📋 Recent Study Reports ({reports.length})</h3>
            {reports.length === 0 && <p className="modal-muted">No reports submitted yet.</p>}
            <div className="modal-reports">
              {reports.slice(0, 10).map((r, i) => (
                <div key={i} className="modal-report-row">
                  <div className="mr-date">
                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="mr-details">
                    <span>⏱️ {r.studyHours}h</span>
                    <span>📝 {r.pyqsSolved || 0} PYQs</span>
                    {r.accuracy && <span>🎯 {r.accuracy}%</span>}
                    {r.mockTestScore && <span>📊 {r.mockTestScore}/100</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pending = students.filter(s => s.status === 'pending')
  const approved = students.filter(s => s.status === 'approved')

  const filtered = students
    .filter(s => filter === 'all' || s.branch === filter)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="mentor-dash">
      <header className="mentor-dash-header">
        <div>
          <h1>Mentor Dashboard</h1>
          <p>Welcome, Bhima Sankar Sir</p>
        </div>
        <button className="btn-outline" onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/login') }}>Logout</button>
      </header>

      {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading students...</p>}

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
              <div key={s._id || s.id} className="student-row pending-row">
                <div className="student-info">
                  <strong>{s.name}</strong>
                  <span>{s.email}</span>
                  <span className="branch-tag">{s.branch}</span>
                  <span className="date">{new Date(s.createdAt || s.registeredAt).toLocaleDateString()}</span>
                </div>
                <div className="student-actions">
                  <button className="approve-btn" onClick={() => handleApprove(s._id || s.id)}>✓ Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(s._id || s.id)}>✕ Reject</button>
                </div>
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
            <div key={s._id || s.id} className="student-row clickable" onClick={() => handleStudentClick(s)}>
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
