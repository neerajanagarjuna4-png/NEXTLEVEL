import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motivationQuotes } from '../data/platformData.js'
import { getSyllabus, countAllTopics } from '../data/syllabus.js'
import GATECountdown from '../components/dashboard/GATECountdown.jsx'
import DailyTaskChecklist from '../components/dashboard/DailyTaskChecklist.jsx'
import MotivationQuotes from '../components/dashboard/MotivationQuotes.jsx'
import SyllabusChecklist from '../components/dashboard/SyllabusChecklist.jsx'
import ProgressVisualization from '../components/dashboard/ProgressVisualization.jsx'
import WorkingHoursTracker from '../components/dashboard/WorkingHoursTracker.jsx'
import RewardSystem from '../components/dashboard/RewardSystem.jsx'
import Leaderboard from '../components/dashboard/Leaderboard.jsx'
import PreparationTracker from '../components/dashboard/PreparationTracker.jsx'
import DailyStudyReport from '../components/dashboard/DailyStudyReport.jsx'
import './StudentDashboard.css'

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const firstName = user.name ? user.name.split(' ')[0] : 'Student'
  const userKey = user.email ? user.email.replace(/[.@]/g, '_') : 'guest'

  useEffect(() => {
    if (!user.email) navigate('/login')
    if (user.status === 'pending') navigate('/pending-approval')
  }, [user.email, user.status, navigate])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'syllabus', icon: '📚', label: 'Syllabus Tracker' },
    { id: 'tasks', icon: '✅', label: 'Daily Tasks' },
    { id: 'report', icon: '📋', label: 'Daily Report' },
    { id: 'tracker', icon: '🎯', label: 'Study Tracker' },
    { id: 'progress', icon: '📈', label: 'Progress' },
    { id: 'rewards', icon: '🏆', label: 'Rewards' },
    { id: 'leaderboard', icon: '🥇', label: 'Leaderboard' },
  ]

  const quickLinks = [
    { id: 'mentor', icon: '👨‍🏫', label: 'Mentor Profile' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <h2 style={{ fontSize: '1rem' }}>NextLevel Mentoring</h2>
            <span style={{ textTransform: 'none', fontSize: '0.65rem' }}>by BhimaSankar.com</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Menu</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}

          <div className="sidebar-section-title" style={{ marginTop: '1rem' }}>Quick Links</div>
          {quickLinks.map(item => (
            <Link key={item.id} to="/mentor-profile" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Click to Logout">
            <div className="sidebar-avatar">{firstName[0]}</div>
            <div className="sidebar-user-info">
              <div className="name">{user.name || 'Student'}</div>
              <div className="role">Logout 👋</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>{getGreeting()}, <span style={{ color: 'var(--color-primary)' }}>{firstName}</span> 👋</h1>
            <p>Here's your GATE preparation summary for today</p>
          </div>
          <div className="header-right">
            <div className="header-search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search topics..." />
            </div>
            <div className="header-notification">
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-header">
                    <div className="stat-icon">📖</div>
                    <span className="stat-label">Study Hours</span>
                  </div>
                  <div className="stat-value">6.5h</div>
                  <span className="stat-change positive">↑ 12% from yesterday</span>
                </div>
                <div className="stat-card purple">
                  <div className="stat-header">
                    <div className="stat-icon">✅</div>
                    <span className="stat-label">Tasks Done</span>
                  </div>
                  <div className="stat-value">8/12</div>
                  <span className="stat-change positive">↑ 3 more than avg</span>
                </div>
                <div className="stat-card green">
                  <div className="stat-header">
                    <div className="stat-icon">📋</div>
                    <span className="stat-label">Syllabus</span>
                  </div>
                  <div className="stat-value">42%</div>
                  <span className="stat-change positive">↑ 2% this week</span>
                </div>
                <div className="stat-card warm">
                  <div className="stat-header">
                    <div className="stat-icon">🔥</div>
                    <span className="stat-label">Streak</span>
                  </div>
                  <div className="stat-value">15</div>
                  <span className="stat-change positive">days in a row!</span>
                </div>
              </div>

              {/* GATE Countdown */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="widget"><GATECountdown /></div>
              </div>

              {/* Preparation Tracker */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="widget"><PreparationTracker /></div>
              </div>

              {/* Motivation + Tasks + Hours */}
              <div className="widgets-grid">
                <div className="widget"><MotivationQuotes /></div>
                <div className="widget"><DailyTaskChecklist /></div>
                <div className="widget"><WorkingHoursTracker /></div>
              </div>

              {/* Progress + Rewards */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="widget"><ProgressVisualization branch={user.branch} userKey={userKey} /></div>
                <div className="widget"><RewardSystem userKey={userKey} /></div>
              </div>
            </>
          )}

          {/* Syllabus Tab */}
          {activeTab === 'syllabus' && (
            <div className="widget" style={{ maxWidth: '100%' }}>
              <SyllabusChecklist branch={user.branch || 'ECE'} userKey={userKey} />
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="widget"><DailyTaskChecklist fullView /></div>
              <div className="widget"><WorkingHoursTracker /></div>
            </div>
          )}

          {/* Daily Report Tab */}
          {activeTab === 'report' && (
            <div className="widget" style={{ maxWidth: '900px' }}>
              <DailyStudyReport userKey={userKey} />
            </div>
          )}

          {/* Study Tracker Tab */}
          {activeTab === 'tracker' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="widget"><PreparationTracker userKey={userKey} /></div>
              <div className="widget"><WorkingHoursTracker userKey={userKey} /></div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="widget">
              <ProgressVisualization branch={user.branch} userKey={userKey} fullView />
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="widget"><RewardSystem /></div>
              <div className="widget"><Leaderboard /></div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="widget">
              <Leaderboard fullView />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
