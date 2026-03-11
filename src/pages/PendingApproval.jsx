import './PendingApproval.css'
import { Link } from 'react-router-dom'
import { mentorInfo } from '../data/platformData.js'

function PendingApproval() {
  return (
    <div className="pending-page animate-fade-in">
      <div className="pending-card glass">
        <div className="pending-icon-animated">
          <span className="pending-clock">⏳</span>
        </div>
        <h1 className="gradient-text">Mentorship Request Submitted</h1>
        <p className="pending-message">
          Your mentorship request is under review by <strong>Bhima Sankar Sir</strong>.
        </p>
        <p className="pending-detail">
          You will receive an email notification once your account is approved. 
          Only approved students can access the NEXT_LEVEL dashboard and all features.
        </p>
        <div className="pending-info">
          <div className="info-item glass">
            <span className="info-icon">📧</span>
            <span>Check your email for updates</span>
          </div>
          <div className="info-item glass">
            <span className="info-icon">⏰</span>
            <span>Typically approved within 24 hours</span>
          </div>
          <div className="info-item glass">
            <span className="info-icon">📞</span>
            <span>Contact: {mentorInfo.phone}</span>
          </div>
        </div>

        {/* Community Resources */}
        <div className="pending-resources">
          <h3 className="gradient-text" style={{ fontSize: '14px', fontWeight: '800' }}>📚 While you wait, explore these resources:</h3>
          <div className="pending-links">
            <a href={mentorInfo.links.youtube} target="_blank" rel="noopener noreferrer" className="pending-resource-btn youtube">
              ▶️ YouTube
            </a>
            <a href={mentorInfo.links.website} target="_blank" rel="noopener noreferrer" className="pending-resource-btn website">
              🌐 Website
            </a>
            <a href={mentorInfo.links.telegram} target="_blank" rel="noopener noreferrer" className="pending-resource-btn telegram">
              ✈️ Telegram
            </a>
            <a href={mentorInfo.links.whatsapp} target="_blank" rel="noopener noreferrer" className="pending-resource-btn whatsapp">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <Link to="/login" className="pending-back-btn">← Back to Login</Link>
      </div>
    </div>
  )
}

export default PendingApproval
