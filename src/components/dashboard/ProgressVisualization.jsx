import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { getSyllabus } from '../../data/syllabus.js'
import './ProgressVisualization.css'

function ProgressVisualization({ branch, fullView, userKey }) {
  const [view, setView] = useState('overall') // overall, high, medium
  
  // Dynamic mock calculation for visualization
  // Calculate real data from localStorage
  const getProgressData = () => {
    const syllabus = getSyllabus(branch)
    const storageKey = `syllabusProgress_${userKey || branch}`
    const savedProgress = JSON.parse(localStorage.getItem(storageKey) || '{}')
    
    let totalTopics = 0
    let completedTopics = 0

    // Filter by view (priority)
    const filteredSyllabus = syllabus.filter(section => {
      if (view === 'overall') return true
      // Include 'foundation' in High Priority as it's crucial
      if (view === 'high') return section.priority === 'high' || section.priority === 'foundation'
      if (view === 'medium') return section.priority === 'medium'
      return true
    })

    filteredSyllabus.forEach(section => {
      section.subjects.forEach(sub => {
        sub.topics.forEach(topic => {
          totalTopics++
          const topicId = `${sub.id}-${topic.name}`
          if (savedProgress[topicId]) {
            completedTopics++
          }
        })
      })
    })

    const notStartedTopics = totalTopics - completedTopics
    
    // Convert to percentages for the pie chart
    const completedPct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)
    const notStartedPct = totalTopics === 0 ? 100 : Math.round((notStartedTopics / totalTopics) * 100)
    
    return [
      { name: 'Completed', value: completedPct, color: 'var(--color-success)' },
      { name: 'Not Started', value: notStartedPct, color: '#e2e8f0' }
    ]
  }

  const getSubjectData = () => {
    const syllabus = getSyllabus(branch)
    const storageKey = `syllabusProgress_${userKey || branch}`
    const savedProgress = JSON.parse(localStorage.getItem(storageKey) || '{}')
    
    let subjectStats = []
    
    const priorityWeights = {
      'foundation': 4,
      'high': 3,
      'medium': 2,
      'supporting': 1
    }

    // Filter by view (priority)
    const filteredSyllabus = syllabus.filter(section => {
      if (view === 'overall') return true
      if (view === 'high') return section.priority === 'high' || section.priority === 'foundation'
      if (view === 'medium') return section.priority === 'medium'
      return true
    })

    filteredSyllabus.forEach(section => {
      section.subjects.forEach(sub => {
        let subTotal = 0
        let subCompleted = 0
        
        sub.topics.forEach(topic => {
          subTotal++
          const topicId = `${sub.id}-${topic.name}`
          if (savedProgress[topicId]) subCompleted++
        })

        if (subTotal > 0) {
          subjectStats.push({
            name: sub.name,
            pct: Math.round((subCompleted / subTotal) * 100),
            weight: priorityWeights[section.priority] || 0
          })
        }
      })
    })

    // Sort by priority weight DESC, then by percentage DESC, then alphabetically
    return subjectStats.sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      if (b.pct !== a.pct) return b.pct - a.pct
      return a.name.localeCompare(b.name)
    })
  }

  const data = getProgressData()
  const subjectData = getSubjectData()

  return (
    <div className={`progress-viz-widget ${fullView ? 'full' : ''}`}>
      <div className="viz-header">
        <h3>📊 {branch} Progress Analytics</h3>
        <select value={view} onChange={e => setView(e.target.value)} className="viz-select">
          <option value="overall">Overall</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
        </select>
      </div>

      <div className="viz-content">
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-center-text">
            <span>{data[0].value}%</span>
            <label>Done</label>
          </div>
        </div>

        <div className="subject-bars">
          <h4>Subject Breakdown</h4>
          {subjectData.map((sub, i) => (
            <div key={i} className="sub-bar-row">
              <div className="sub-bar-info">
                <span className="sub-name">{sub.name}</span>
                <span className="sub-pct">{sub.pct}%</span>
              </div>
              <div className="sub-bar-bg">
                <div className="sub-bar-fill" style={{ width: `${sub.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressVisualization
