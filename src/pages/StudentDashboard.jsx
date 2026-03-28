import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
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
import PersonalTimetable from '../components/dashboard/PersonalTimetable.jsx'
import MentorshipFlow from '../components/dashboard/MentorshipFlow.jsx'
import BottomNav from '../components/common/BottomNav.jsx'
import './StudentDashboard.css'


function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])
  const [liveStats, setLiveStats] = useState({ studyHours: 0, tasksDone: 0, tasksTotal: 0, syllabusPercent: 0, streak: 0 })
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const firstName = user.name ? user.name.split(' ')[0] : 'Student'
  const userKey = user.email ? user.email.replace(/[.@]/g, '_') : 'guest'

  useEffect(() => {
    if (!user.email) navigate('/login')
    if (user.status === 'pending') navigate('/pending-approval')
    if (user._id && token) fetchLiveStats()
  }, [user.email, user.status, navigate])

  const fetchLiveStats = async () => {
    try {
      const [progressRes, tasksRes, streakRes, syllabusRes] = await Promise.all([
        axios.get(`/api/student/progress/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} })),
        axios.get(`/api/student/daily-tasks/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} })),
        axios.get(`/api/student/streak/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} })),
        axios.get(`/api/student/syllabus-progress/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} }))
      ])
      setLiveStats({
        studyHours: progressRes.data?.progress?.today?.studyHours || 0,
        tasksDone: tasksRes.data?.completedCount || 0,
        tasksTotal: tasksRes.data?.totalCount || 0,
        syllabusPercent: syllabusRes.data?.percentage || 0,
        streak: streakRes.data?.streak || 0
      })
    } catch (err) {
      console.error('Failed to fetch live stats:', err)
    }
  }

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
    { id: 'timetable', icon: '📅', label: 'My Timetable' },
    { id: 'journey', icon: '🗺️', label: 'My Journey' },
    { id: 'leaderboard', icon: '🥇', label: 'Leaderboard' },
    { id: 'mentor-profile', icon: '👨‍🏫', label: 'Mentor Profile' },
  ]

  const quickLinks = []

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/images/nextlevel-logo.jpg" alt="NEXT_LEVEL" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <h2 className="gradient-text">NextLevel</h2>
            <span>by Bhima Sankar Sir</span>
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

          <div className="sidebar-section-title">Quick Links</div>
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
              <div className="name" style={{ fontWeight: '700' }}>{user.name || 'Student'}</div>
              <div className="role" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Sign Out →</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header animate-fade-in">
          <div className="header-left">
            <h1>{getGreeting()}, <span className="gradient-text">{firstName}</span> 👋</h1>
            <p>Welcome back to your premium mentorship portal</p>
          </div>
          <div className="header-right">
            <div className="header-search glass">
              <span>🔍</span>
              <input type="text" placeholder="Search topics..." />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="stats-grid animate-fade-in">
                <div className="stat-card blue">
                  <span className="stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-light)' }}>Study Hours</span>
                  <span className="stat-value gradient-text">{liveStats.studyHours.toFixed(1)}h</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '700', marginTop: '4px' }}>📅 Today</p>
                </div>
                <div className="stat-card purple">
                  <span className="stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-light)' }}>Tasks Done</span>
                  <span className="stat-value" style={{ color: 'var(--color-secondary)' }}>{liveStats.tasksDone}/{liveStats.tasksTotal}</span>
                  <p style={{ fontSize: '11px', color: liveStats.tasksDone === liveStats.tasksTotal && liveStats.tasksTotal > 0 ? 'var(--color-success)' : '#64748b', fontWeight: '700', marginTop: '4px' }}>
                    {liveStats.tasksDone === liveStats.tasksTotal && liveStats.tasksTotal > 0 ? '✅ All done!' : '⏳ In progress'}
                  </p>
                </div>
                <div className="stat-card green">
                  <span className="stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-light)' }}>Syllabus</span>
                  <span className="stat-value" style={{ color: 'var(--color-success)' }}>{liveStats.syllabusPercent}%</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '700', marginTop: '4px' }}>
                    {liveStats.syllabusPercent >= 50 ? '🚀 Great progress' : '📚 Keep going'}
                  </p>
                </div>
                <div className="stat-card warm">
                  <span className="stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-light)' }}>Streak</span>
                  <span className="stat-value" style={{ color: 'var(--color-warning)' }}>{liveStats.streak}</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: '700', marginTop: '4px' }}>
                    {liveStats.streak >= 7 ? '🔥 On fire!' : liveStats.streak > 0 ? '💪 Building up' : '🚀 Start today'}
                  </p>
                </div>
              </div>

              {/* GATE Countdown */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="widget glass"><GATECountdown /></div>
              </div>

              {/* Preparation Tracker */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="widget glass"><PreparationTracker /></div>
              </div>

              {/* Motivation + Tasks + Hours */}
              <div className="widgets-grid">
                <div className="widget glass"><MotivationQuotes /></div>
                <div className="widget glass"><DailyTaskChecklist /></div>
                <div className="widget glass"><WorkingHoursTracker /></div>
              </div>

              {/* Mentorship Journey */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="widget glass"><MentorshipFlow /></div>
              </div>

              {/* Progress + Rewards */}
              <div className="widgets-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="widget glass"><ProgressVisualization branch={user.branch} userKey={userKey} /></div>
                <div className="widget glass"><RewardSystem userKey={userKey} /></div>
              </div>
            </>
          )}

          {/* Syllabus Tab */}
          {activeTab === 'syllabus' && (
            <div className="widget glass" style={{ maxWidth: '100%' }}>
              <SyllabusChecklist branch={user.branch || 'ECE'} userKey={userKey} />
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="widget glass"><DailyTaskChecklist fullView /></div>
              <div className="widget glass"><WorkingHoursTracker /></div>
            </div>
          )}

          {/* Daily Report Tab */}
          {activeTab === 'report' && (
            <div className="widget glass" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <DailyStudyReport userKey={userKey} />
            </div>
          )}

          {/* Study Tracker Tab */}
          {activeTab === 'tracker' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="widget glass"><PreparationTracker userKey={userKey} /></div>
              <div className="widget glass"><WorkingHoursTracker userKey={userKey} /></div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="widget glass">
              <ProgressVisualization branch={user.branch} userKey={userKey} fullView />
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="widget glass"><RewardSystem /></div>
              <div className="widget glass"><Leaderboard /></div>
            </div>
          )}

          {/* My Timetable Tab */}
          {activeTab === 'timetable' && (
            <div className="widget glass">
              <PersonalTimetable />
            </div>
          )}

          {/* My Journey Tab */}
          {activeTab === 'journey' && (
            <div className="widget glass">
              <MentorshipFlow />
            </div>
          )}

          {/* Mentor Profile Tab */}
          {activeTab === 'mentor-profile' && (
            <div className="widget glass mentor-profile-tab">
              <div className="mp-hero">
                <div className="mp-avatar">👨‍🏫</div>
                <div className="mp-info">
                  <h2>Bhima Sankar Sir</h2>
                  <p>MTech – IIT Kharagpur &nbsp;|&nbsp; PhD – IIIT Hyderabad</p>
                  <p>Founder of NEXT_LEVEL &nbsp;|&nbsp; 14+ Years Experience</p>
                  <span className="mp-badge">Your Personal Mentor 🌟</span>
                </div>
              </div>
              <div className="mp-links">
                <a href="https://m.youtube.com/@Next_Level_by_Bhima_Sankar" target="_blank" rel="noreferrer" className="mp-link youtube">▶ YouTube</a>
                <a href="https://Nextlevel.akamai.net.in" target="_blank" rel="noreferrer" className="mp-link website">🌐 Website</a>
                <a href="https://t.me/shankar10GATE" target="_blank" rel="noreferrer" className="mp-link telegram">✈ Telegram</a>
                <a href="https://chat.whatsapp.com/EyUYumDUZVc2KJ6kkpvVLn" target="_blank" rel="noreferrer" className="mp-link whatsapp">💬 WhatsApp</a>
              </div>
              <style>{`
                .mentor-profile-tab { text-align:center; }
                .mp-hero { display:flex; flex-direction:column; align-items:center; gap:12px; margin-bottom:20px; }
                .mp-avatar { font-size:80px; }
                .mp-info h2 { margin:0; font-size:1.4rem; font-weight:900; color:#0F172A; }
                .mp-info p { margin:4px 0; color:#475569; font-size:0.88rem; }
                .mp-badge { display:inline-block; background:#FFF7ED; color:#F97316; padding:4px 14px; border-radius:20px; font-size:0.8rem; font-weight:800; margin-top:8px; }
                .mp-links { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:8px; }
                .mp-link { padding:12px 22px; border-radius:12px; font-weight:800; font-size:0.9rem; text-decoration:none; transition:all 0.2s; }
                .mp-link:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.15); }
                .youtube { background:#FF0000; color:#fff; }
                .website { background:#0F172A; color:#fff; }
                .telegram { background:#0088cc; color:#fff; }
                .whatsapp { background:#25D366; color:#fff; }
              `}</style>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="widget glass">
              <Leaderboard fullView />
            </div>
          )}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default StudentDashboard
