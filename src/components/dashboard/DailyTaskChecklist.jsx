import { useState, useEffect } from 'react'
import { defaultDailyTasks } from '../../data/platformData.js'
import './DailyTaskChecklist.css'

function DailyTaskChecklist({ fullView }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('dailyTasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    } else {
      setTasks(defaultDailyTasks.map(t => ({ ...t, completed: false })))
    }
  }, [])

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('dailyTasks', JSON.stringify(newTasks))
  }

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    saveTasks(updated)
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const updated = [...tasks, { id: Date.now(), text: newTask, category: 'Custom', completed: false }]
    saveTasks(updated)
    setNewTask('')
  }
  
  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id)
    saveTasks(updated)
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
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <label className="task-label">
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
              <span className="task-custom-check"></span>
              <span className="task-text">{task.text}</span>
            </label>
            {fullView && <button className="task-delete" onClick={() => deleteTask(task.id)}>×</button>}
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
