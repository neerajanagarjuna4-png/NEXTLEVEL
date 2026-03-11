import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Check if we should stay logged in
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      if (user.role === 'mentor') navigate('/mentor-dashboard')
      else navigate('/dashboard')
    }

    // 2. IMPORTANT: Auto-initialize the "Database" if it's empty
    // This ensures your accounts aren't "lost" on a new Netlify link
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const hasSir = existingUsers.some(u => u.email === 'sankar.bhima@gmail.com')
    const hasUser = existingUsers.some(u => u.email === 'neerajanagarjuna4@gmail.com')

    if (!hasSir || !hasUser) {
      const otherUsers = existingUsers.filter(u => u.email !== 'neerajanagarjuna4@gmail.com' && u.email !== 'sankar.bhima@gmail.com')
      const initialUsers = [
        ...otherUsers,
        {
          id: 'sir_master',
          name: 'Bhima Sankar Sir',
          email: 'sankar.bhima@gmail.com',
          password: 'masterpassword',
          role: 'mentor',
          status: 'approved'
        },
        {
          id: 'user_account',
          name: 'Nagarjuna User',
          email: 'nagarjunaneeraja4@gmail.com',
          password: 'password123', // I set a default for new links
          branch: 'ECE',
          role: 'student',
          status: 'approved',
          registeredAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('users', JSON.stringify(initialUsers))
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    const normalizedEmail = email.trim().toLowerCase()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Find student (Note: Mentor is handled on /mentor-login)
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password)
    
    if (!user) {
      setError('Invalid student email or password. Are you a mentor? Use the link below.')
      return
    }

    if (user.status === 'pending') {
      navigate('/pending-approval')
      return
    }

    localStorage.setItem('user', JSON.stringify(user))
    navigate('/dashboard')
  }

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-logo">
            <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="auth-logo-img" />
            <h1 className="gradient-text">Student Login</h1>
            <p className="tagline">Personal Guidance by Bhima Sankar Sir</p>
          </div>

          {error && <div className="auth-error animate-fade-in">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Student Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                required
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
            </div>

            <div className="auth-options" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
                Stay Signed In
              </label>
            </div>

            <button type="submit" className="auth-submit">Enter Student Dashboard</button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Request Mentorship</Link>
            <div className="mentor-link-box">
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Are you the Mentor?</span>
              <Link to="/mentor-login" style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '1rem' }}>Mentor Portal Access →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
