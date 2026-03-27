import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      if (user.role === 'mentor') navigate('/mentor-dashboard')
      else navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      if (user.status === 'pending') {
        navigate('/pending-approval')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="auth-logo-img" />
            <h1>Student Login</h1>
            <p className="tagline">Personal Guidance by Bhima Sankar Sir</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

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
                <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
            </div>

            <div className="auth-options" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-10px', marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                Stay Signed In
              </label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter Student Dashboard'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Request Mentorship</Link>
            <div className="mentor-link-box" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              Are you the Mentor? <Link to="/mentor-login" style={{ color: '#1e3a8a', fontWeight: '700' }}>Mentor Portal Access →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
