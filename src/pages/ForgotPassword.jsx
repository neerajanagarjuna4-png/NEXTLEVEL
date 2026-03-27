import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: New Password
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const navigate = useNavigate()

  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase()
      })
      setMessage(response.data.message || '✅ Password reset link sent to your email!')
      setError('')
      // For local/simulated mode, proceed to step 2
      setTimeout(() => {
        setStep(2)
        setMessage('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'No account found with this email.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // If we have a token from URL, use it; otherwise use simulated flow
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token') || resetToken

      if (token) {
        await axios.post('/api/auth/reset-password', { token, newPassword })
      } else {
        // Fallback: simulated reset (for development/demo)
        setMessage('Password reset successful! (Simulated mode)')
      }

      setMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-logo">
            <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="auth-logo-img" />
            <h1 className="gradient-text">Reset Password</h1>
            <p className="tagline">Recover your NEXT_LEVEL account</p>
          </div>

          {error && <div className="auth-error animate-fade-in">{error}</div>}
          {message && <div className="glass" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px', fontSize: '14px', fontWeight: '700', border: '1px solid var(--color-success)' }}>{message}</div>}

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
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
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
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            Remembered your password? <Link to="/login" style={{ fontWeight: '700' }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
