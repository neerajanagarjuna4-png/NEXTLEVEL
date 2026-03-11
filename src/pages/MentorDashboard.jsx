import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSyllabus } from '../data/syllabus.js'
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
    
    // Initialize or load students
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setStudents(allUsers)
  }, [navigate])

  const stats = {
    pending: students.filter(s => s.status === 'pending').length,
    approved: students.filter(s => s.status === 'approved').length,
    ece: students.filter(s => s.branch === 'ECE').length,
    ee: students.filter(s => s.branch === 'EE').length,
    cse: students.filter(s => s.branch === 'CSE').length
  }

  const filtered = students
    .filter(s => filter === 'all' || s.branch === filter)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))

  const handleApprove = (id) => {
    const updated = students.map(s => s.id === id ? { ...s, status: 'approved', approvedAt: new Date().toISOString() } : s)
    setStudents(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="mentor-dash-page animate-fade-in">
      <header className="mentor-header-premium">
        <div className="header-content">
          <div className="header-info">
            <h1 className="gradient-text">Mentor Dashboard</h1>
            <p className="welcome-msg">Welcome back, Bhima Sankar Sir</p>
          </div>
          <button className="logout-btn-premium" onClick={handleLogout}>Logout →</button>
        </div>
      </header>

      <main className="mentor-main-content">
        {/* Stats Grid */}
        <div className="m-stats-grid">
          <div className="m-stat-card glass blue">
            <span className="m-val">{stats.pending}</span>
            <span className="m-lab">Pending Approvals</span>
          </div>
          <div className="m-stat-card glass purple">
            <span className="m-val">{stats.approved}</span>
            <span className="m-lab">Active Students</span>
          </div>
          <div className="m-stat-card glass info">
            <span className="m-val">{stats.ece}</span>
            <span className="m-lab">ECE Branch</span>
          </div>
          <div className="m-stat-card glass success">
            <span className="m-val">{stats.ee}</span>
            <span className="m-lab">EE Branch</span>
          </div>
          <div className="m-stat-card glass warning">
            <span className="m-val">{stats.cse}</span>
            <span className="m-lab">CSE Branch</span>
          </div>
        </div>

        {/* Student Section */}
        <div className="m-section-container glass">
          <div className="m-section-header">
            <h2>Student Management</h2>
            <div className="m-controls">
              <div className="m-search glass">
                <span>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="m-filters">
                {['all', 'ECE', 'EE', 'CSE'].map(f => (
                  <button 
                    key={f} 
                    className={`m-filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="m-student-list">
            {filtered.length === 0 && <p className="no-data">No students matching your criteria.</p>}
            {filtered.map(student => (
              <div key={student.id} className={`m-student-item ${student.status}-row`}>
                <div className="m-stud-info">
                  <div className="m-stud-avatar">{student.name[0]}</div>
                  <div className="m-stud-details">
                    <span className="m-name">{student.name}</span>
                    <span className="m-email">{student.email}</span>
                  </div>
                </div>
                <div className="m-stud-branch">
                  <span className="m-branch-tag">{student.branch}</span>
                </div>
                <div className="m-stud-status">
                  <span className={`m-status-tag ${student.status}`}>{student.status}</span>
                </div>
                <div className="m-stud-actions">
                  {student.status === 'pending' ? (
                    <button className="m-action-btn primary" onClick={() => handleApprove(student.id)}>Approve</button>
                  ) : (
                    <button className="m-action-btn secondary">View Growth →</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MentorDashboard
