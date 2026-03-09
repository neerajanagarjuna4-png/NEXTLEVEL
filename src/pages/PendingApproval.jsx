import './PendingApproval.css'
import { Link } from 'react-router-dom'
import { mentorInfo } from '../data/platformData.js'

function PendingApproval() {
  return (
    <div className="pending-page">
      <div className="pending-card">
        <div className="pending-icon-animated">
          <span className="pending-clock">⏳</span>
        </div>
        <h1>Mentorship Request Submitted</h1>
        <p className="pending-message">
          Your mentorship request is under review by <strong>Bhima Sankar Sir</strong>.
        </p>
        <p className="pending-detail">
          You will receive an email notification once your account is approved. 
          Only approved students can access the NEXT_LEVEL dashboard and all features.
        </p>
        <div className="pending-info">
          <div className="info-item">
            <span className="info-icon">📧</span>
            <span>Check your email for updates</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <span>Typically approved within 24 hours</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <span>Contact: {mentorInfo.phone}</span>
          </div>
        </div>

        {/* Community Resources */}
        <div className="pending-resources">
          <h3>📚 While you wait, explore these resources:</h3>
          <div className="pending-links">
            <a href={mentorInfo.links.youtube} target="_blank" rel="noopener noreferrer" className="pending-resource-btn youtube">
              ▶️ YouTube Channel
            </a>
            <a href={mentorInfo.links.website} target="_blank" rel="noopener noreferrer" className="pending-resource-btn website">
              🌐 nextlevel guidance by BhimaSankar
            </a>
            <a href={mentorInfo.links.telegram} target="_blank" rel="noopener noreferrer" className="pending-resource-btn telegram">
              ✈️ Telegram Community
            </a>
            <a href={mentorInfo.links.whatsapp} target="_blank" rel="noopener noreferrer" className="pending-resource-btn whatsapp">
              💬 WhatsApp Community
            </a>
          </div>
        </div>

        <Link to="/login" className="pending-back-btn">← Back to Login</Link>
      </div>
    </div>
  )
}

export default PendingApproval
