import { useState, useEffect } from 'react'
import { getSyllabus, countAllTopics } from '../../data/syllabus.js'
import './SyllabusChecklist.css'

function SyllabusChecklist({ branch, userKey }) {
  const [syllabus, setSyllabus] = useState([])
  const [progress, setProgress] = useState({})
  const [expandedSection, setExpandedSection] = useState('High Priority Subjects')

  useEffect(() => {
    const data = getSyllabus(branch)
    setSyllabus(data)
    
    // Load progress from local storage - Scoped by userKey
    const storageKey = `syllabusProgress_${userKey || branch}`
    const savedProgress = localStorage.getItem(storageKey)
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [branch, userKey])

  const handleToggleSubtopic = (subjectName, topicName, subtopicName) => {
    const key = `${subjectName}_${topicName}_${subtopicName}`
    const newProgress = { ...progress, [key]: !progress[key] }
    setProgress(newProgress)
    const storageKey = `syllabusProgress_${userKey || branch}`
    localStorage.setItem(storageKey, JSON.stringify(newProgress))
  }

  const isSubtopicCompleted = (subjectName, topicName, subtopicName) => {
    const key = `${subjectName}_${topicName}_${subtopicName}`
    return progress[key] === true
  }

  const getTopicProgress = (subjectName, topicName, subtopics) => {
    if (!subtopics || subtopics.length === 0) return { completed: 0, total: 0, percentage: 0 }
    
    let completed = 0
    subtopics.forEach(sub => {
      if (isSubtopicCompleted(subjectName, topicName, sub)) completed++
    })
    
    return {
      completed,
      total: subtopics.length,
      percentage: Math.round((completed / subtopics.length) * 100)
    }
  }

  const getSubjectProgress = (subject) => {
    let completed = 0
    let total = 0
    
    subject.topics.forEach(topic => {
      // In this version, the topics array directly contains subtopics strings
      // We'll treat the subject itself as having topics, and the topics array elements as subtopics due to the flat structure for simplicity.
      // Actually, looking at the data structure: subject = { name: "NETWORKS", topics: ["Superposition", "Thevenin...", ...] }
      // So subjectName = "NETWORKS", subtopicName = "Superposition"
      if (isSubtopicCompleted(subject.name, 'General', topic)) completed++
      total++
    })
    
    return {
      completed,
      total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
    }
  }

  const getOverallProgress = () => {
    let completed = 0
    let total = 0
    
    syllabus.forEach(section => {
      section.subjects.forEach(subject => {
        const stats = getSubjectProgress(subject)
        completed += stats.completed
        total += stats.total
      })
    })
    
    return {
      completed,
      total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      hoursLeft: (total - completed) * 2 // Estimate 2 hours per topic
    }
  }

  const getRecommendation = () => {
    const allSubjects = syllabus
      .filter(section => section.priority === 'foundation' || section.priority === 'high')
      .flatMap(section => section.subjects)
    
    if (allSubjects.length === 0) return null

    // Find the core subject with lowest percentage
    const stats = allSubjects.map(sub => ({
      name: sub.name,
      ...getSubjectProgress(sub)
    }))

    const leastCompleted = stats.sort((a, b) => a.percentage - b.percentage)[0]
    return leastCompleted
  }

  const overall = getOverallProgress()
  const recommendation = getRecommendation()

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
          <span className="est-time">⏱️ Est. {overall.hoursLeft} hours left</span>
        </div>
      </div>

      {recommendation && (
        <div className="smart-recommendation">
          <strong>📌 Smart Recommendation:</strong> Focus on <span>{recommendation.name}</span> - {recommendation.percentage === 0 ? 'Not started yet.' : `Only ${recommendation.percentage}% complete.`}
        </div>
      )}

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
            .flatMap(section => section.subjects.map(s => ({ ...s, priority: section.priority })))
            .map((subject, idx) => {
              const stats = getSubjectProgress(subject)
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

      <div className="syllabus-accordion">
        {syllabus.map((section, idx) => (
          <div key={idx} className={`syllabus-section priority-${section.priority}`}>
            <div 
              className="section-header" 
              onClick={() => setExpandedSection(expandedSection === section.name ? null : section.name)}
            >
              <h3>
                {section.priority === 'high' ? '⭐ ' : ''}
                {section.name}
              </h3>
              <span className="expand-icon">{expandedSection === section.name ? '▼' : '▶'}</span>
            </div>
            
            {expandedSection === section.name && (
              <div className="section-content">
                {section.subjects.map((subject, sIdx) => {
                  const subStats = getSubjectProgress(subject)
                  return (
                    <div key={sIdx} className="subject-card">
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
                          const isDone = isSubtopicCompleted(subject.name, 'General', topic)
                          return (
                            <label key={tIdx} className={`topic-item ${isDone ? 'completed' : ''}`}>
                              <input 
                                type="checkbox" 
                                checked={isDone}
                                onChange={() => handleToggleSubtopic(subject.name, 'General', topic)}
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
