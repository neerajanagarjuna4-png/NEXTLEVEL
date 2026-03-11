import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [branch, setBranch] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const branches = [
    { id: 'ECE', label: 'ECE', full: 'Electronics & Communication', icon: '📡' },
    { id: 'EE', label: 'EE', full: 'Electrical Engineering', icon: '⚡' },
    { id: 'CSE', label: 'CSE', full: 'Computer Science', icon: '💻' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !branch) {
      setError('Please fill in all fields and select your branch')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists')
      return
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      branch,
      role: 'student',
      status: 'pending',
      registeredAt: new Date().toISOString(),
      streak: 0,
      points: 0,
      level: 1,
      badges: [],
      targets: { daily: 8, weekly: 50, monthly: 200 },
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Send email notification to mentor via backend API
    try {
      await fetch('/api/notify-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: name, studentEmail: email, branch })
      })
    } catch (err) {
      console.error('Failed to send email notification:', err)
    }

    // Save notification locally as well
    const notifications = JSON.parse(localStorage.getItem('mentorNotifications') || '[]')
    notifications.push({
      id: Date.now().toString(),
      type: 'new_registration',
      studentName: name,
      studentEmail: email,
      branch,
      date: new Date().toISOString(),
      read: false,
    })
    localStorage.setItem('mentorNotifications', JSON.stringify(notifications))

    navigate('/pending-approval')
  }

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-logo">
            <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="auth-logo-img" />
            <h1 className="gradient-text">NEXT_LEVEL</h1>
            <p className="tagline">Personal Guidance by Bhima Sankar Sir</p>
          </div>

          {error && <div className="auth-error animate-fade-in">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password (min 8 characters)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
            </div>

            <div className="form-group">
              <label>Select Your Branch</label>
              <div className="branch-selector">
                {branches.map(b => (
                  <div
                    key={b.id}
                    className={`branch-option ${branch === b.id ? 'selected' : ''}`}
                    onClick={() => { setBranch(b.id); setError('') }}
                  >
                    <span className="branch-icon">{b.icon}</span>
                    <strong>{b.label}</strong>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-submit">Request Mentorship</button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
