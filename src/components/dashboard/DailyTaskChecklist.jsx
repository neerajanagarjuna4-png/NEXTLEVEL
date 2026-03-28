import { useState, useEffect } from 'react'
import axios from 'axios'
import './DailyTaskChecklist.css'

function DailyTaskChecklist({ fullView }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [allCompleted, setAllCompleted] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (user._id && token) fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/student/daily-tasks/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(res.data.tasks || [])
      setAllCompleted(res.data.allCompleted || false)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (index) => {
    const updated = tasks.map((t, i) => i === index ? { ...t, completed: !t.completed } : t)
    setTasks(updated)
    try {
      const res = await axios.post(`/api/student/daily-tasks/${user._id}`, {
        date: new Date().toISOString(),
        tasks: updated
      }, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(res.data.tasks || updated)
      setAllCompleted(res.data.allCompleted || false)
    } catch (err) {
      console.error('Failed to update tasks:', err)
    }
  }

  const done = tasks.filter(t => t.completed).length
  const total = tasks.length

  if (loading) return <div className="task-checklist"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading tasks...</p></div>

  return (
    <div className="task-checklist">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>✅ Daily Tasks</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: allCompleted ? '#10b981' : '#64748b' }}>
          {done}/{total} Done
        </span>
      </div>
      <div className="task-progress-bar">
        <div className="task-progress-fill" style={{ width: total > 0 ? `${(done/total)*100}%` : '0%' }} />
      </div>
      <ul className="task-list">
        {tasks.map((task, i) => (
          <li key={task._id || i}
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(i)}
          >
            <span className="task-checkbox">{task.completed ? '✅' : '⬜'}</span>
            <span className="task-name">{task.name}</span>
          </li>
        ))}
      </ul>
      {allCompleted && (
        <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginTop: '8px' }}>
          🎉 All tasks completed! Your streak grows!
        </p>
      )}
    </div>
  )
}

export default DailyTaskChecklist
