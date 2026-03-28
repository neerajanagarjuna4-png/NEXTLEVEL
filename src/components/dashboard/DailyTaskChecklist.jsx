import { useState, useEffect } from 'react'
import axios from 'axios'
import { defaultDailyTasks } from '../../data/platformData.js'
import './DailyTaskChecklist.css'

function DailyTaskChecklist({ fullView }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)

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
      // Map API task.name to task.text for compatibility with existing UI if needed, but we'll adapt the UI slightly
      setTasks(res.data.tasks || [])
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
    } catch (err) {
      console.error('Failed to update tasks:', err)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const updated = [...tasks, { name: newTask, category: 'Custom', completed: false }]
    setTasks(updated)
    setNewTask('')
    try {
      const res = await axios.post(`/api/student/daily-tasks/${user._id}`, {
        date: new Date().toISOString(),
        tasks: updated
      }, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(res.data.tasks || updated)
    } catch (err) {
      console.error('Failed to add task:', err)
    }
  }
  
  const deleteTask = async (index) => {
    const updated = tasks.filter((_, i) => i !== index)
    setTasks(updated)
    try {
      const res = await axios.post(`/api/student/daily-tasks/${user._id}`, {
        date: new Date().toISOString(),
        tasks: updated
      }, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(res.data.tasks || updated)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className={`daily-tasks-widget ${fullView ? 'full' : ''}`}>
      <div className="tasks-header">
        <h3>📝 Today's Tasks</h3>
        <span className="tasks-progress-text">{completedCount}/{totalCount} Completed</span>
      </div>
      
      <div className="tasks-progress">
        <div className="tasks-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="tasks-list">
        {tasks.map((task, i) => (
          <div key={task._id || i} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <label className="task-label">
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(i)} />
              <span className="task-custom-check"></span>
              <span className="task-text">{task.name || task.text}</span>
            </label>
            {fullView && <button className="task-delete" onClick={() => deleteTask(i)}>×</button>}
          </div>
        ))}
      </div>

      <form className="task-add-form" onSubmit={addTask}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add a new task..." 
        />
        <button type="submit">+</button>
      </form>
    </div>
  )
}

export default DailyTaskChecklist
