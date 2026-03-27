import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'overview', icon: '🏠', label: 'Home' },
  { id: 'syllabus', icon: '📚', label: 'Syllabus' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'timetable', icon: '📅', label: 'Timetable' },
  { id: 'rewards', icon: '🏆', label: 'Rewards' }
]

/**
 * BottomNav – mobile-only navigation bar.
 * Props:
 *   activeTab: string – current active tab id
 *   setActiveTab: function – tab change handler
 */
export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <>
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
          >
            <span className="bn-icon">{item.icon}</span>
            <span className="bn-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <style>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #0F172A;
          border-top: 2px solid #1E293B;
          height: 64px;
          align-items: center;
          justify-content: space-around;
          padding: 0 8px;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        @media (max-width: 768px) {
          .bottom-nav { display: flex; }
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 10px;
          transition: all 0.2s;
          min-width: 52px;
          min-height: 44px;
          color: #64748B;
        }
        .bottom-nav-item.active {
          color: #F97316;
        }
        .bottom-nav-item:active {
          transform: scale(0.92);
        }
        .bn-icon {
          font-size: 1.3rem;
          line-height: 1;
          transition: transform 0.2s;
        }
        .bottom-nav-item.active .bn-icon {
          transform: scale(1.2);
        }
        .bn-label {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </>
  )
}
