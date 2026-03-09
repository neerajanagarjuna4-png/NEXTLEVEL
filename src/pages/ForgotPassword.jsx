import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: New Password
  const navigate = useNavigate()

  const handleCheckEmail = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userExists = users.some(u => u.email === email)
    
    if (userExists || email === 'sankar.bhima@gmail.com') {
      setMessage('✅ Verification code sent to your email! (Simulated)')
      setError('')
      setTimeout(() => {
        setStep(2)
        setMessage('')
      }, 1500)
    } else {
      setError('No account found with this email.')
    }
  }

  const handleReset = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, password: newPassword }
      }
      return u
    })

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setMessage('Password reset successful! Redirecting to login...')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="auth-logo-img" />
            <h1>Reset Password</h1>
            <p className="tagline">Recover your NEXT_LEVEL account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

          {step === 1 ? (
            <form className="auth-form" onSubmit={handleCheckEmail}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="auth-submit">Verify Email</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleReset}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="auth-submit">Update Password</button>
            </form>
          )}

          <div className="auth-footer">
            Remembered your password? <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
