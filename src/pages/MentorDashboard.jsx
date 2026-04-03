import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket.js'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import TimetableEditor from '../components/mentor/TimetableEditor.jsx'
import './MentorDashboard.css'

const API = import.meta.env.VITE_API_URL || ''

function MentorDashboard() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudentData, setSelectedStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailTab, setDetailTab] = useState('reports')
  const [stepsData, setStepsData] = useState([])
  const [stepsSaving, setStepsSaving] = useState(false)
  const [viewTab, setViewTab] = useState('students') // 'pending' | 'students' | 'stories' | 'feed'
  const [stories, setStories] = useState([])
  const [feed, setFeed] = useState([])
  const [feedbacks, setFeedbacks] = useState([])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'mentor') {
      navigate('/login')
      return
    }
    fetchStudents()
  }, [navigate])

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/api/mentor/students`, getAuthHeaders())
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
      setStudents(allUsers.filter(u => u.role !== 'mentor'))
    } finally {
      setLoading(false)
    }
  }

  const socket = useSocket()
  useEffect(() => {
    if (!socket) return
    // Refresh student list on common events
    socket.on('progress-updated', () => fetchStudents())
    socket.on('syllabus-updated', () => fetchStudents())
    socket.on('student-approved', () => fetchStudents())

    // Live feed items
    const pushFeed = (item) => setFeed(prev => [{ ...item, ts: Date.now() }, ...prev].slice(0, 200))

    socket.on('new-story-pending', (payload) => pushFeed({ type: 'story-pending', text: `New story pending: ${payload.title}`, payload }))
    socket.on('story-approved', (payload) => pushFeed({ type: 'story-approved', text: `Story approved (${payload.storyId})`, payload }))
    socket.on('progress-updated', (payload) => pushFeed({ type: 'progress', text: `Progress updated by ${payload.userId}`, payload }))
    socket.on('journey-updated', (payload) => pushFeed({ type: 'journey', text: `Journey updated for ${payload.userId}`, payload }))
    socket.on('mentor_feedback', (payload) => pushFeed({ type: 'feedback', text: `New mentor feedback for ${payload.feedbackId}`, payload }))

    return () => {
      socket.off('progress-updated')
      socket.off('syllabus-updated')
      socket.off('student-approved')
      socket.off('new-story-pending')
      socket.off('story-approved')
      socket.off('journey-updated')
      socket.off('mentor_feedback')
    }
  }, [socket])

  useEffect(() => {
    if (viewTab === 'stories') fetchStories()
  }, [viewTab])

  const fetchStudentTracker = async (studentId) => {
    try {
      const res = await axios.get(`${API}/api/mentor/student/${studentId}/tracker`, getAuthHeaders())
      setSelectedStudentData(prev => ({ ...(prev||{}), trackerLogs: res.data.logs || [] }))
    } catch (err) {
      console.error('Error fetching tracker logs', err)
      setSelectedStudentData(prev => ({ ...(prev||{}), trackerLogs: [] }))
    }
  }

  const fetchFeedback = async (studentId) => {
    try {
      const res = await axios.get(`${API}/api/feedback/${studentId}`, getAuthHeaders())
      setSelectedStudentData(prev => ({ ...(prev||{}), feedbacks: res.data.feedback || [] }))
    } catch (err) {
      console.error('Error fetching feedback', err)
    }
  }

  const handleAddRemark = async (log) => {
    const text = window.prompt('Enter mentor remark for this tracker entry:')
    if (!text) return
    try {
      const studentId = selectedStudent._id || selectedStudent.id
      await axios.post(`${API}/api/feedback`, { studentId, text: `Remark (${new Date(log.date).toLocaleDateString()}): ${text}`, type: 'remark', isPublic: false }, getAuthHeaders())
      toast.success('Bhima Sir added a remark!')
      fetchFeedback(studentId)
    } catch (err) {
      console.error('Add remark error', err)
      toast.error('Failed to add remark')
    }
  }

  const fetchStories = async () => {
    try {
      const res = await axios.get(`${API}/api/stories`, getAuthHeaders())
      setStories(res.data.stories || [])
    } catch (err) {
      console.error('Error fetching stories', err)
      setStories([])
    }
  }

  const approveStory = async (id) => {
    try {
      await axios.put(`${API}/api/stories/${id}/approve`, {}, getAuthHeaders())
      setStories(prev => prev.filter(s => s._id !== id && s.id !== id))
      toast.success('Your story is live! 🎉')
    } catch (err) {
      console.error('Approve story error', err)
      toast.error('Failed to approve story')
    }
  }

  const addFeedback = async (text) => {
    if (!selectedStudent || !text) return
    try {
      const studentId = selectedStudent._id || selectedStudent.id
      await axios.post(`${API}/api/feedback`, { studentId, text, type: 'mentor', isPublic: true }, getAuthHeaders())
      fetchFeedback(studentId)
    } catch (err) {
      console.error('Add feedback error', err)
      alert('Failed to send feedback')
    }
  }

  const handleSaveSteps = async () => {
    if (!selectedStudent) return
    setStepsSaving(true)
    try {
      const id = selectedStudent._id || selectedStudent.id
      const res = await axios.post(`${API}/api/mentor/step/${id}`, { steps: stepsData }, getAuthHeaders())
      setStepsData(res.data.steps || stepsData)
      toast.success('Steps updated successfully!')
    } catch (err) {
      console.error('Save steps error:', err)
        toast.error('Failed to update steps')
    } finally {
      setStepsSaving(false)
    }
  }

  const toggleStep = (stepNum, completed) => {
    setStepsData(prev => prev.map(s => s.stepNumber === stepNum ? { ...s, completed } : s))
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const renderStudentDetail = () => {
    if (!selectedStudent) return null
    const s = selectedStudent
    const data = selectedStudentData || { reports: [], metrics: {}, timetable: null }
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

          <div className="modal-sub-tabs">
            {[[ 'overview','👤 Overview' ],[ 'tracker','📊 Tracker' ],[ 'reports','📋 Reports' ],[ 'syllabus','📚 Syllabus' ],[ 'feedback','✉️ Feedback' ],['timetable','📅 Timetable'],['steps','🗺️ Steps']].map(([id,label]) => (
              <button 
                key={id} 
                className={`modal-sub-tab ${detailTab === id ? 'active' : ''}`} 
                onClick={() => { setDetailTab(id); if (id === 'tracker') fetchStudentTracker(s._id || s.id); if (id === 'feedback') fetchFeedback(s._id || s.id) }}
              >
                {label}
              </button>
            ))}
          </div>

          {detailTab === 'overview' && (
            <div className="modal-section">
              <h3>Overview</h3>
              <p className="modal-muted">High level metrics and quick links.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <div className="modal-stat" style={{ padding: 12 }}>
                  <div className="ms-num">{metrics.streak || 0}</div>
                  <div className="ms-label">Streak</div>
                </div>
                <div className="modal-stat" style={{ padding: 12 }}>
                  <div className="ms-num">{metrics.consistencyScore || 0}%</div>
                  <div className="ms-label">Consistency</div>
                </div>
                <div className="modal-stat" style={{ padding: 12 }}>
                  <div className="ms-num">{reports.length}</div>
                  <div className="ms-label">Reports</div>
                </div>
                <div className="modal-stat" style={{ padding: 12 }}>
                  <div className="ms-num">{data.syllabusPercentage ?? 0}%</div>
                  <div className="ms-label">Syllabus</div>
                </div>
              </div>
            </div>
          )}

          {detailTab === 'tracker' && (
            <div className="modal-section">
              <h3>📊 Read-only Tracker</h3>
              <p className="modal-muted">View daily tracker logs. Use "Add Remark" to send mentor feedback for a row.</p>
              {(!data.trackerLogs || data.trackerLogs.length === 0) && <p className="modal-muted">No tracker logs available.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {(data.trackerLogs || []).map((log, idx) => (
                  <div key={idx} style={{ border: '1px solid #E2E8F0', padding: 12, borderRadius: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{new Date(log.date).toLocaleDateString()}</div>
                      <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{(log.entries || []).map(e => `${e.subject}: ${e.hours}h`).join(' • ')}</div>
                      {log.mentorRemarks && <div style={{ marginTop:8, color: '#065f46' }}>Mentor: {log.mentorRemarks}</div>}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <button className="steps-save-btn" onClick={() => handleAddRemark(log)}>Add Remark</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === 'feedback' && (
            <div className="modal-section">
              <h3>✉️ Mentor Feedback</h3>
              <p className="modal-muted">Send guidance or quick remarks to the student.</p>
              <div style={{ marginTop: 12 }}>
                <textarea id="mentor-feedback-text" rows={4} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} placeholder="Write feedback..." />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="steps-save-btn" onClick={() => { const t = document.getElementById('mentor-feedback-text').value; addFeedback(t); document.getElementById('mentor-feedback-text').value=''; }}>Send Feedback</button>
                  <button className="m-action-btn secondary" onClick={() => fetchFeedback(s._id || s.id)}>Refresh</button>
                </div>

                <div style={{ marginTop: 14 }}>
                  {(data.feedbacks || []).map((fb, i) => (
                    <div key={i} style={{ border: '1px solid #F1F5F9', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                      <div style={{ fontWeight: 700 }}>{fb.mentorId?.name || 'Mentor'}</div>
                      <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{fb.text}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: 6 }}>{new Date(fb.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {detailTab === 'syllabus' && (
            <div className="modal-section">
              <h3>📚 Syllabus Progress</h3>
              <p className="modal-muted">Completed: {data.syllabusPercentage ?? 0}%</p>
            </div>
          )}

          {detailTab === 'reports' && (
            <div className="modal-content-area">
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
          )}

          {detailTab === 'timetable' && (
            <div className="modal-section">
              <TimetableEditor
                studentId={selectedStudent?._id || selectedStudent?.id}
                existingTimetable={data.timetable}
                onSaved={(updated) => setSelectedStudentData(prev => ({ ...prev, timetable: updated }))}
              />
            </div>
          )}

          {detailTab === 'steps' && (
            <div className="modal-section">
              <h3>🗺️ Mentorship Journey Progress</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '16px' }}>
                Check steps as you complete them with the student.
              </p>
              <div className="steps-list">
                {stepsData.length === 0 && (
                  <p className="modal-muted">No steps data yet. Steps will appear after the student's first session.</p>
                )}
                {stepsData.map((step) => (
                  <label key={step.stepNumber} className={`step-row ${step.completed ? 'done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={e => toggleStep(step.stepNumber, e.target.checked)}
                    />
                    <div className="step-row-info">
                      <span className="step-row-num">Step {step.stepNumber}</span>
                      <span className="step-row-title">{step.title}</span>
                      {step.completed && step.completedAt && (
                        <span className="step-row-date">✅ {new Date(step.completedAt).toLocaleDateString('en-IN')}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {stepsData.length > 0 && (
                <button className="steps-save-btn" onClick={handleSaveSteps} disabled={stepsSaving}>
                  {stepsSaving ? '⏳ Saving...' : '💾 Save Steps'}
                </button>
              )}
            </div>
          )}
        </div>
        <style>{`
          .modal-content-area { max-height: 480px; overflow-y: auto; padding-right: 5px; }
          .modal-sub-tabs { display:flex; gap:8px; margin:16px 0; border-bottom:2px solid #E2E8F0; padding-bottom:0; }
          .modal-sub-tab { padding:8px 18px; background:none; border:none; border-bottom:3px solid transparent; cursor:pointer; font-size:0.85rem; font-weight:700; color:#64748B; transition:all 0.2s; }
          .modal-sub-tab.active { color:#F97316; border-bottom-color:#F97316; }
          .steps-list { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
          .step-row { display:flex; gap:12px; align-items:flex-start; padding:12px 14px; background:#F8FAFC; border:2px solid #E2E8F0; border-radius:10px; cursor:pointer; transition:all 0.2s; }
          .step-row.done { border-color:#10B981; background:#F0FDF4; }
          .step-row input { margin-top:3px; width:18px; height:18px; accent-color:#10B981; }
          .step-row-info { flex:1; }
          .step-row-num { font-size:0.7rem; font-weight:700; color:#94A3B8; display:block; }
          .step-row-title { font-size:0.88rem; font-weight:700; color:#1E293B; display:block; }
          .step-row-date { font-size:0.75rem; color:#10B981; font-weight:600; display:block; margin-top:2px; }
          .steps-save-btn { width:100%; padding:12px; background:linear-gradient(135deg,#10B981,#059669); color:#fff; border:none; border-radius:10px; font-weight:800; font-size:0.9rem; cursor:pointer; transition:all 0.2s; }
          .steps-save-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 15px rgba(16,185,129,0.4); }
          .steps-save-btn:disabled { opacity:0.6; }
        `}</style>
      </div>
    )
  }

  const pending = students.filter(s => s.status === 'pending')
  const approved = students.filter(s => s.status === 'approved')
  const filtered = students
    .filter(s => filter === 'all' || s.branch === filter)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="mentor-dash-page animate-fade-in">
      {renderStudentDetail()}
      
      <header className="mentor-header-premium">
        <div className="header-content">
          <div className="header-info">
            <h1 className="gradient-text">Mentor Dashboard</h1>
            <p className="welcome-msg">Welcome back, Bhima Sankar Sir</p>
          </div>
          <button className="logout-btn-premium" onClick={handleLogout}>Logout →</button>
        </div>
      </header>

      <main className="mentor-main">
        {loading && <div className="loader">Loading student data...</div>}

        {!loading && (
          <>
            {/* Stats Row */}
            <div className="mentor-stats-row">
              <div className="mentor-stat-card">
                <span className="m-stat-num">{pending.length}</span>
                <span className="m-stat-label">Pending</span>
              </div>
              <div className="mentor-stat-card">
                <span className="m-stat-num">{approved.length}</span>
                <span className="m-stat-label">Total Guided</span>
              </div>
              <div className="mentor-stat-card">
                <span className="m-stat-num">{students.filter(s => s.branch === 'ECE').length}</span>
                <span className="m-stat-label">ECE</span>
              </div>
              <div className="mentor-stat-card">
                <span className="m-stat-num">{students.filter(s => s.branch === 'EE').length}</span>
                <span className="m-stat-label">EE</span>
              </div>
              <div className="mentor-stat-card">
                <span className="m-stat-num">{students.filter(s => s.branch === 'CSE').length}</span>
                <span className="m-stat-label">CSE</span>
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
                    placeholder="🔍 Search name..."
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
              <p className="click-hint">💡 Click student to update Timetable & Journey</p>
              <div className="students-list">
                {filtered.length === 0 && <p className="empty-text">No students found.</p>}
                {filtered.map(s => (
                  <div key={s._id || s.id} className={`student-row clickable ${s.status === 'pending' ? 'pending-row' : ''}`} onClick={() => handleStudentClick(s)}>
                    <div className="student-info">
                      <strong>{s.name}</strong>
                      <span>{s.email}</span>
                      <span className="branch-tag">{s.branch}</span>
                      <span className={`status-tag ${s.status}`}>{s.status}</span>
                    </div>
                    {s.status === 'pending' && (
                      <div className="student-actions" onClick={e => e.stopPropagation()}>
                        <button className="approve-btn" onClick={() => handleApprove(s._id || s.id)}>✓</button>
                        <button className="reject-btn" onClick={() => handleReject(s._id || s.id)}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      
      <style>{`
        .mentor-main { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .click-hint { font-size: 0.85rem; color: #64748B; margin-bottom: 12px; font-weight: 600; }
        .loader { text-align: center; padding: 40px; color: #64748B; font-weight: 700; }
        .pending-row { border-left: 4px solid #F97316!important; }
        .student-row.clickable { cursor: pointer; transition: background 0.2s; }
        .student-row.clickable:hover { background: #F1F5F9; }
      `}</style>
    </div>
  )
}

export default MentorDashboard
