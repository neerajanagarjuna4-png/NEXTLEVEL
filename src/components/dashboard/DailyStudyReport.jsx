import { useState, useEffect } from 'react'
import axios from 'axios'
import { getSyllabus } from '../../data/syllabus.js'
import './DailyStudyReport.css'

const MOODS = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '😌', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'stressed', emoji: '😰', label: 'Stressed' },
]

function DailyStudyReport({ userKey }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const branch = user.branch || 'ECE'
  const userId = userKey || user.id || user.email || 'default'

  const syllabus = getSyllabus(branch)
  const allSubjects = syllabus.flatMap(section => section.subjects.map(s => s.name))

  const todayStr = new Date().toISOString().split('T')[0]

  const [reports, setReports] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [viewMode, setViewMode] = useState('form') // 'form' | 'history'

  // Form state
  const [date, setDate] = useState(todayStr)
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState('')
  const [studyHours, setStudyHours] = useState(0)
  const [pyqsSolved, setPyqsSolved] = useState(0)
  const [mockTestScore, setMockTestScore] = useState('')
  const [accuracy, setAccuracy] = useState('')
  const [difficulties, setDifficulties] = useState('')
  const [tomorrowPlan, setTomorrowPlan] = useState('')
  const [mood, setMood] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  const [loadingReports, setLoadingReports] = useState(true)

  useEffect(() => {
    if (user._id && token) fetchRecentReports()
  }, [user._id, token])

  const fetchRecentReports = async () => {
    try {
      const res = await axios.get(`/api/student/study-reports/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // map backend field 'subject' to 'subjects' array required by old UI 
      const mappedReports = (res.data.reports || []).map(r => ({
        ...r,
        subjects: r.subject ? r.subject.split(', ') : [],
        topics: r.topic || ''
      }))
      setReports(mappedReports)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoadingReports(false)
    }
  }

  const saveReports = (updated) => {
    setReports(updated)
    localStorage.setItem(`studyReports_${userId}`, JSON.stringify(updated))
  }

  const toggleSubject = (subj) => {
    setSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    )
  }

  const resetForm = () => {
    setDate(todayStr)
    setSubjects([])
    setTopics('')
    setStudyHours(0)
    setPyqsSolved(0)
    setMockTestScore('')
    setAccuracy('')
    setDifficulties('')
    setTomorrowPlan('')
    setMood('')
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !mood || studyHours <= 0) {
      setError('Please fill date, study hours, and mood.')
      return
    }
    if (new Date(date) > new Date()) {
      setError('Cannot submit a report for a future date.')
      return
    }

    try {
      setSuccess('Submitting...')
      setError('')
      await axios.post('/api/student/study-report', {
        userId: user._id,
        date: date,
        subject: subjects.join(', '),
        topic: topics,
        studyHours: Number(studyHours),
        pyqsSolved: Number(pyqsSolved) || 0,
        mockTestScore: mockTestScore ? Number(mockTestScore) : null,
        accuracy: accuracy ? Number(accuracy) : null,
        difficulties: difficulties,
        tomorrowPlan: tomorrowPlan,
        mood: mood
      }, { headers: { Authorization: `Bearer ${token}` } })

      setSuccess(editingId ? 'Report updated successfully!' : 'Report submitted! 🎉')
      resetForm()
      fetchRecentReports()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || 'Failed to submit report.'}`)
      setSuccess('')
    }
  }

  const handleEdit = (report) => {
    setEditingId(report.id)
    setDate(report.date)
    setSubjects(report.subjects || [])
    setTopics(report.topics || '')
    setStudyHours(report.studyHours)
    setPyqsSolved(report.pyqsSolved || 0)
    setMockTestScore(report.mockTestScore || '')
    setAccuracy(report.accuracy || '')
    setDifficulties(report.difficulties || '')
    setTomorrowPlan(report.tomorrowPlan || '')
    setMood(report.mood || '')
    setViewMode('form')
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this report?')) return
    const updated = reports.filter(r => r.id !== id)
    saveReports(updated)
  }

  const sortedReports = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="study-report-widget">
      <div className="report-tabs">
        <button
          className={`report-tab ${viewMode === 'form' ? 'active' : ''}`}
          onClick={() => { setViewMode('form'); resetForm() }}
        >
          📝 {editingId ? 'Edit Report' : 'New Report'}
        </button>
        <button
          className={`report-tab ${viewMode === 'history' ? 'active' : ''}`}
          onClick={() => setViewMode('history')}
        >
          📋 History ({reports.length})
        </button>
      </div>

      {success && <div className="report-success">{success}</div>}
      {error && <div className="report-error">{error}</div>}

      {viewMode === 'form' && (
        <form className="report-form" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="form-row">
            <label>📅 Date</label>
            <input type="date" value={date} max={todayStr} onChange={e => setDate(e.target.value)} />
          </div>

          {/* Subjects multi-select */}
          <div className="form-row">
            <label>📚 Subjects Studied</label>
            <div className="subject-chips">
              {allSubjects.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`subject-chip ${subjects.includes(s) ? 'selected' : ''}`}
                  onClick={() => toggleSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Topics covered */}
          <div className="form-row">
            <label>📖 Topics Covered</label>
            <input
              type="text"
              placeholder="e.g., Eigenvalues, Superposition Theorem"
              value={topics}
              onChange={e => setTopics(e.target.value)}
            />
          </div>

          {/* Number fields row */}
          <div className="form-numbers">
            <div className="form-row">
              <label>⏱️ Study Hours</label>
              <input type="number" min="0" max="24" step="0.5" value={studyHours} onChange={e => setStudyHours(e.target.value)} />
            </div>
            <div className="form-row">
              <label>📝 PYQs Solved</label>
              <input type="number" min="0" value={pyqsSolved} onChange={e => setPyqsSolved(e.target.value)} />
            </div>
            <div className="form-row">
              <label>📊 Mock Test Score</label>
              <input type="number" min="0" max="100" placeholder="Optional" value={mockTestScore} onChange={e => setMockTestScore(e.target.value)} />
            </div>
            <div className="form-row">
              <label>🎯 Accuracy %</label>
              <input type="number" min="0" max="100" placeholder="Optional" value={accuracy} onChange={e => setAccuracy(e.target.value)} />
            </div>
          </div>

          {/* Difficulties */}
          <div className="form-row">
            <label>😕 Difficulties Faced</label>
            <textarea rows="2" placeholder="Any challenges or concepts you struggled with..." value={difficulties} onChange={e => setDifficulties(e.target.value)} />
          </div>

          {/* Plan for tomorrow */}
          <div className="form-row">
            <label>📋 Plan for Tomorrow</label>
            <textarea rows="2" placeholder="What do you plan to study tomorrow?" value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} />
          </div>

          {/* Mood */}
          <div className="form-row">
            <label>🧠 How are you feeling?</label>
            <div className="mood-picker">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
                  onClick={() => setMood(m.value)}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="report-submit-btn">
            {editingId ? '✏️ Update Report' : '📤 Submit Report'}
          </button>
        </form>
      )}

      {viewMode === 'history' && (
        <div className="report-history">
          {sortedReports.length === 0 && (
            <div className="report-empty">
              <p>No reports submitted yet. Start by filling out today's study report!</p>
            </div>
          )}
          {sortedReports.map(r => (
            <div key={r.id} className="report-card">
              <div className="report-card-header">
                <span className="report-date">{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <div className="report-actions">
                  <button className="edit-btn" onClick={() => handleEdit(r)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>🗑️</button>
                </div>
              </div>
              <div className="report-card-body">
                <div className="report-stats-row">
                  <span>⏱️ {r.studyHours}h</span>
                  <span>📝 {r.pyqsSolved} PYQs</span>
                  {r.mockTestScore !== null && <span>📊 {r.mockTestScore}/100</span>}
                  {r.accuracy !== null && <span>🎯 {r.accuracy}%</span>}
                  <span>{MOODS.find(m => m.value === r.mood)?.emoji || '😐'}</span>
                </div>
                {r.subjects?.length > 0 && (
                  <div className="report-subjects">
                    {r.subjects.map(s => <span key={s} className="report-subject-tag">{s}</span>)}
                  </div>
                )}
                {r.topics && <p className="report-topics">📖 {r.topics}</p>}
                {r.difficulties && <p className="report-diff">😕 {r.difficulties}</p>}
                {r.tomorrowPlan && <p className="report-plan">📋 {r.tomorrowPlan}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DailyStudyReport
