import { Link } from 'react-router-dom'
import { mentorInfo } from '../data/platformData.js'
import './MentorProfilePage.css'

function MentorProfilePage() {
  return (
    <div className="mentor-page animate-fade-in">
      <div className="mentor-page-header glass">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1 className="gradient-text">Mentor Profile</h1>
      </div>

      <div className="mentor-hero glass">
        <div className="mentor-photo-section">
          <div className="mentor-photo-frame">
            <img src="/images/bhimasir-mentor.jpg" alt="Bhima Sankar Sir" className="mentor-photo-large" />
          </div>
          <h2 className="gradient-text">{mentorInfo.name}</h2>
          <p className="mentor-title-text">M.Tech – IIT Kharagpur | PhD – IIIT Hyderabad</p>
          <p className="mentor-founder">Founder of NEXT_LEVEL</p>
          <div className="mentor-phone glass">
            📞 Direct Mentorship Line: <strong className="gradient-text">{mentorInfo.phone}</strong>
          </div>
        </div>

        <div className="mentor-qualifications">
          <h3 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Qualifications & Experience</h3>
          <div className="qual-grid">
            {mentorInfo.qualifications.map((q, i) => (
              <div key={i} className="qual-item glass">
                <span className="qual-icon">✦</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mentor-content-grid">
        {/* Subjects of Expertise */}
        <div className="mentor-section glass">
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>📖 Subjects of Expertise</h3>
          <div className="subjects-grid">
            {mentorInfo.subjects.map((s, i) => (
              <div key={i} className="subject-chip glass">{s}</div>
            ))}
          </div>
        </div>

        {/* Mentor's Dream */}
        <div className="mentor-section glass mentor-dream">
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>💫 My Dream</h3>
          <blockquote>"{mentorInfo.dream}"</blockquote>
          <p className="quote-sig" style={{ fontWeight: '800' }}>— Bhima Sankar Sir</p>
        </div>

        {/* Personal Quotes */}
        <div className="mentor-section glass" style={{ gridColumn: 'span 2' }}>
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>💬 Words from Bhima Sankar Sir</h3>
          <div className="quotes-list">
            {mentorInfo.quotes.map((q, i) => (
              <div key={i} className="quote-card glass">
                <span className="quote-mark">"</span>
                <p>{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message to Students */}
        <div className="mentor-section glass">
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>📝 Message to Students</h3>
          <blockquote>"{mentorInfo.messageToStudents}"</blockquote>
          <p className="quote-sig" style={{ fontWeight: '800' }}>— Bhima Sankar Sir</p>
        </div>

        {/* Motto */}
        <div className="mentor-section glass mentor-motto">
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>🎯 Our Motto</h3>
          {mentorInfo.motto.map((m, i) => (
            <p key={i} className="motto-line" style={{ fontWeight: '800' }}>{m}</p>
          ))}
        </div>

        {/* Community Links */}
        <div className="mentor-section glass" style={{ gridColumn: 'span 2' }}>
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>🌐 Join Our Community</h3>
          <div className="community-links">
            <a href={mentorInfo.links.youtube} target="_blank" rel="noopener noreferrer" className="community-link youtube">
              <span>▶️</span> YouTube Channel
            </a>
            <a href={mentorInfo.links.website} target="_blank" rel="noopener noreferrer" className="community-link website">
              <span>🌐</span> Official Website
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
        <div className="mentor-section glass" style={{ gridColumn: 'span 2' }}>
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem' }}>📝 Mock Tests (OHM Institute)</h3>
          <div className="community-links">
            {mentorInfo.mockTests && mentorInfo.mockTests.map((test, i) => (
              <a key={i} href={test.url} target="_blank" rel="noopener noreferrer" className="community-link glass" style={{ fontWeight: '800' }}>
                <span>{test.icon}</span> {test.label}
              </a>
            ))}
          </div>
          <p className="mocktest-note">*Login to your OHM account for full access.</p>
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
