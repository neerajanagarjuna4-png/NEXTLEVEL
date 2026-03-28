import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { getSyllabus } from '../../data/syllabus.js'
import './SyllabusChecklist.css'

function SyllabusChecklist({ branch }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const [syllabus, setSyllabus] = useState([])
  const [progress, setProgress] = useState({})
  const [overallStats, setOverallStats] = useState({ total: 0, completed: 0, percentage: 0 })
  const [expandedSection, setExpandedSection] = useState('High Priority Subjects')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getSyllabus(branch)
    setSyllabus(data)
    if (user._id && token) {
      fetchProgress()
    } else {
      setLoading(false)
    }
  }, [branch])

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`/api/student/syllabus-progress/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Build a lookup map from the API progress array
      const progressMap = {}
      if (res.data.progress) {
        res.data.progress.forEach(p => {
          const key = `${p.subjectIndex}_${p.topicIndex}_${p.subtopicIndex}`
          progressMap[key] = p.completed
        })
      }
      setProgress(progressMap)
      setOverallStats({
        total: res.data.totalSubtopics || 0,
        completed: res.data.completedSubtopics || 0,
        percentage: res.data.percentage || 0
      })
    } catch (err) {
      console.error('Failed to fetch syllabus progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSubtopic = async (subjectName, topicName, subtopicName, subjectIndex, topicIndex, subtopicIndex) => {
    const key = `${subjectIndex}_${topicIndex}_${subtopicIndex}`
    const newCompleted = !progress[key]
    
    // Optimistic update
    setProgress(prev => ({ ...prev, [key]: newCompleted }))

    try {
      const res = await axios.post(`/api/student/syllabus-progress/${user._id}`, {
        subjectIndex,
        topicIndex,
        subtopicIndex,
        completed: newCompleted
      }, { headers: { Authorization: `Bearer ${token}` } })

      setOverallStats({
        total: res.data.totalSubtopics || overallStats.total,
        completed: res.data.completedSubtopics || 0,
        percentage: res.data.percentage || 0
      })
    } catch (err) {
      console.error('Failed to update syllabus:', err)
      // Revert on error
      setProgress(prev => ({ ...prev, [key]: !newCompleted }))
    }
  }

  // Index-based check using flattened indexes from the local data
  const isCompleted = (sectionIdx, subjectIdx, topicIdx) => {
    // Map (section, subject, topic) to the flat (subjectIndex, topicIndex, subtopicIndex)
    // The backend uses: subjectIndex = index across all subjects in the branch
    // Since the frontend groups by section, we need a mapping
    const key = `${sectionIdx}_${subjectIdx}_${topicIdx}`
    return progress[key] === true
  }

  const getSubjectProgress = (sectionIdx, subjectIdx, topics) => {
    let completed = 0
    topics.forEach((_, tIdx) => {
      if (progress[`${sectionIdx}_${subjectIdx}_${tIdx}`]) completed++
    })
    return {
      completed,
      total: topics.length,
      percentage: topics.length === 0 ? 0 : Math.round((completed / topics.length) * 100)
    }
  }

  const getOverallProgress = () => {
    let completed = 0
    let total = 0
    syllabus.forEach((section, sIdx) => {
      section.subjects.forEach((subject, subIdx) => {
        subject.topics.forEach((_, tIdx) => {
          total++
          if (progress[`${sIdx}_${subIdx}_${tIdx}`]) completed++
        })
      })
    })
    return {
      completed,
      total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      hoursLeft: (total - completed) * 2
    }
  }

  const overall = overallStats.total > 0 ? overallStats : getOverallProgress()

  if (loading) return <div className="syllabus-checklist"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading syllabus...</p></div>

  return (
    <div className="syllabus-checklist">
      <div className="syllabus-header">
        <h2 className="section-title">📚 {branch} Syllabus Progress</h2>
        <div className="overall-progress-bar">
          <div className="progress-fill" style={{ width: `${overall.percentage}%` }}></div>
        </div>
        <div className="overall-stats">
          <span>Overall: {overall.percentage}% Complete</span>
          <span>{overall.completed}/{overall.total} Topics</span>
          <span className="est-time">⏱️ Est. {(overall.total - overall.completed) * 2} hours left</span>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="subject-breakdown-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Subject Breakdown</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Sorted by Priority</span>
        </div>
        <div className="subject-breakdown-grid">
          {[...syllabus]
            .sort((a, b) => {
              const weights = { foundation: 4, high: 3, medium: 2, supporting: 1 }
              return (weights[b.priority] || 0) - (weights[a.priority] || 0)
            })
            .flatMap((section, sIdx) => section.subjects.map((s, subIdx) => ({ ...s, priority: section.priority, sIdx, subIdx })))
            .map((subject, idx) => {
              const stats = getSubjectProgress(subject.sIdx, subject.subIdx, subject.topics)
              return (
                <div key={idx} className={`breakdown-card priority-${subject.priority}`}>
                  <div className="breakdown-header">
                    <span className="breakdown-name">
                      {subject.priority === 'foundation' || subject.priority === 'high' ? '⭐ ' : ''}
                      {subject.name}
                    </span>
                    <span className="breakdown-pct">{stats.percentage}%</span>
                  </div>
                  <div className="breakdown-progress-bg">
                    <div className="breakdown-progress-fill" style={{ width: `${stats.percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Accordion */}
      <div className="syllabus-accordion">
        {syllabus.map((section, sIdx) => (
          <div key={sIdx} className={`syllabus-section priority-${section.priority}`}>
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === section.name ? null : section.name)}>
              <h3>{section.priority === 'high' ? '⭐ ' : ''}{section.name}</h3>
              <span className="expand-icon">{expandedSection === section.name ? '▼' : '▶'}</span>
            </div>
            
            {expandedSection === section.name && (
              <div className="section-content">
                {section.subjects.map((subject, subIdx) => {
                  const subStats = getSubjectProgress(sIdx, subIdx, subject.topics)
                  return (
                    <div key={subIdx} className="subject-card">
                      <div className="subject-header">
                        <h4>{subject.name}</h4>
                        <div className="subject-stats">
                          <span className="stat-pct">{subStats.percentage}%</span>
                          <span className="stat-count">({subStats.completed}/{subStats.total})</span>
                        </div>
                      </div>
                      <div className="subject-progress-bar">
                        <div className="progress-fill" style={{ width: `${subStats.percentage}%` }}></div>
                      </div>
                      
                      <div className="topics-list">
                        {subject.topics.map((topic, tIdx) => {
                          const isDone = !!progress[`${sIdx}_${subIdx}_${tIdx}`]
                          return (
                            <label key={tIdx} className={`topic-item ${isDone ? 'completed' : ''}`}>
                              <input 
                                type="checkbox" 
                                checked={isDone}
                                onChange={() => handleToggleSubtopic(subject.name, 'General', topic, sIdx, subIdx, tIdx)}
                              />
                              <span className="custom-checkbox"></span>
                              <span className="topic-name">{topic}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SyllabusChecklist
