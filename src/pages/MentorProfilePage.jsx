import { Link } from 'react-router-dom'
import { mentorInfo } from '../data/platformData.js'
import './MentorProfilePage.css'

function MentorProfilePage() {
  return (
    <div className="mentor-page">
      <div className="mentor-page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Mentor Profile</h1>
      </div>

      <div className="mentor-hero">
        <div className="mentor-photo-section">
          <div className="mentor-photo-frame">
            <img src="/images/bhimasir-mentor.jpg" alt="Bhima Sankar Sir" className="mentor-photo-large" />
          </div>
          <h2>{mentorInfo.name}</h2>
          <p className="mentor-title-text">M.Tech – IIT Kharagpur | PhD – IIIT Hyderabad</p>
          <p className="mentor-founder">Founder of NEXT_LEVEL</p>
          <p className="mentor-phone">📞 Direct Mentorship Line: <strong>{mentorInfo.phone}</strong></p>
        </div>

        <div className="mentor-qualifications">
          <h3>Qualifications & Experience</h3>
          <div className="qual-grid">
            {mentorInfo.qualifications.map((q, i) => (
              <div key={i} className="qual-item">
                <span className="qual-icon">✦</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mentor-content-grid">
        {/* Subjects of Expertise */}
        <div className="mentor-section card">
          <h3>📖 Subjects of Expertise</h3>
          <div className="subjects-grid">
            {mentorInfo.subjects.map((s, i) => (
              <div key={i} className="subject-chip">{s}</div>
            ))}
          </div>
        </div>

        {/* Mentor's Dream */}
        <div className="mentor-section card mentor-dream">
          <h3>💫 My Dream</h3>
          <blockquote>"{mentorInfo.dream}"</blockquote>
          <p className="quote-sig">— Bhima Sankar Sir</p>
        </div>

        {/* Personal Quotes */}
        <div className="mentor-section card" style={{ gridColumn: 'span 2' }}>
          <h3>💬 Words from Bhima Sankar Sir</h3>
          <div className="quotes-list">
            {mentorInfo.quotes.map((q, i) => (
              <div key={i} className="quote-card">
                <span className="quote-mark">"</span>
                <p>{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message to Students */}
        <div className="mentor-section card">
          <h3>📝 Message to Students</h3>
          <blockquote>"{mentorInfo.messageToStudents}"</blockquote>
          <p className="quote-sig">— Bhima Sankar Sir</p>
        </div>

        {/* Motto */}
        <div className="mentor-section card mentor-motto">
          <h3>🎯 Our Motto</h3>
          {mentorInfo.motto.map((m, i) => (
            <p key={i} className="motto-line">{m}</p>
          ))}
        </div>

        {/* Community Links */}
        <div className="mentor-section card" style={{ gridColumn: 'span 2' }}>
          <h3>🌐 Join Our Community</h3>
          <div className="community-links">
            <a href={mentorInfo.links.youtube} target="_blank" rel="noopener noreferrer" className="community-link youtube">
              <span>▶️</span> YouTube Channel
            </a>
            <a href={mentorInfo.links.website} target="_blank" rel="noopener noreferrer" className="community-link website">
              <span>🌐</span> nextlevel guidance by BhimaSankar
            </a>
            <a href={mentorInfo.links.telegram} target="_blank" rel="noopener noreferrer" className="community-link telegram">
              <span>✈️</span> Telegram Community
            </a>
            <a href={mentorInfo.links.whatsapp} target="_blank" rel="noopener noreferrer" className="community-link whatsapp">
              <span>💬</span> WhatsApp Community
            </a>
          </div>
        </div>

        {/* Mock Tests Section */}
        <div className="mentor-section card" style={{ gridColumn: 'span 2' }}>
          <h3>📝 Mock Tests (OHM Institute)</h3>
          <div className="community-links">
            {mentorInfo.mockTests && mentorInfo.mockTests.map((test, i) => (
              <a key={i} href={test.url} target="_blank" rel="noopener noreferrer" className="community-link mocktest">
                <span>{test.icon}</span> {test.label}
              </a>
            ))}
          </div>
          <p className="mocktest-note">*You may need to log in to your OHM Institute account to access these tests.</p>
        </div>

        {/* Student Reviews */}
        <div className="mentor-section card" style={{ gridColumn: 'span 2' }}>
          <h3>⭐ Student Success Stories</h3>
          <p className="reviews-note">Real reviews from real students. Share your success story!</p>
          <div className="reviews-empty">
            <p>No reviews submitted yet. Be the first to share your success story!</p>
            <button className="btn-primary">Share Your Story</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfilePage
