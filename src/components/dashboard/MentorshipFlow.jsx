import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

const STEP_CONFIG = [
  { icon: '🤝', color: '#6366F1' },
  { icon: '🎯', color: '#F97316' },
  { icon: '📚', color: '#10B981' },
  { icon: '📅', color: '#3B82F6' },
  { icon: '💪', color: '#EF4444' },
  { icon: '🔄', color: '#8B5CF6' },
  { icon: '📹', color: '#F59E0B' },
  { icon: '👁️', color: '#0F172A' }
]

export default function MentorshipFlow() {
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSteps()
  }, [])

  const fetchSteps = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API}/api/student/mentorship-steps`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSteps(res.data.steps || [])
    } catch (err) {
      // Fallback to defaults if API fails
      setSteps([
        { stepNumber: 1, title: 'Initial consultation and understanding your needs', completed: false },
        { stepNumber: 2, title: 'Identify Your Goal', completed: false },
        { stepNumber: 3, title: 'Fix the Resources', completed: false },
        { stepNumber: 4, title: 'Plan the Schedule', completed: false },
        { stepNumber: 5, title: 'Start Working', completed: false },
        { stepNumber: 6, title: 'Regular Feedback', completed: false },
        { stepNumber: 7, title: 'Weekly Zoom Call', completed: false },
        { stepNumber: 8, title: 'Continuous Monitoring', completed: false }
      ])
    } finally {
      setLoading(false)
    }
  }

  const completedCount = steps.filter(s => s.completed).length
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0
  const activeStep = steps.findIndex(s => !s.completed)

  return (
    <div className="flow-widget">
      <div className="flow-header">
        <div>
          <h3>🗺️ Your Mentorship Journey</h3>
          <p>8-Step path to GATE success with Bhima Sankar Sir</p>
        </div>
        <div className="flow-progress-badge">
          {completedCount}/{steps.length} Steps
        </div>
      </div>

      {/* Overall progress */}
      <div className="flow-overall-progress">
        <div className="flow-progress-bar">
          <div className="flow-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="flow-pct">{progressPct}%</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="flow-spinner" />
        </div>
      ) : (
        <div className="flow-steps">
          {steps.map((step, idx) => {
            const cfg = STEP_CONFIG[idx] || { icon: '⭐', color: '#64748B' }
            const isActive = idx === activeStep
            const isDone = step.completed

            return (
              <div key={step.stepNumber} className={`flow-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className={`flow-connector ${isDone ? 'done' : ''}`} />
                )}
                <div className="step-icon-wrap" style={{ background: isDone ? cfg.color : '#E2E8F0', borderColor: isActive ? cfg.color : 'transparent' }}>
                  {isDone ? '✓' : cfg.icon}
                </div>
                <div className="step-info">
                  <div className="step-num">Step {step.stepNumber}</div>
                  <div className="step-title">{step.title}</div>
                  {isDone && step.completedAt && (
                    <div className="step-date">
                      ✅ Completed {new Date(step.completedAt).toLocaleDateString('en-IN')}
                    </div>
                  )}
                  {isActive && !isDone && (
                    <div className="step-current-label">← You are here</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .flow-widget { font-family: 'Inter', sans-serif; }
        .flow-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
        .flow-header h3 { margin:0 0 4px; font-size:1.05rem; font-weight:800; color:#0F172A; }
        .flow-header p { margin:0; font-size:0.8rem; color:#64748B; }
        .flow-progress-badge { background:#FFF7ED; border:2px solid #F97316; color:#F97316; padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:800; white-space:nowrap; }
        .flow-overall-progress { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .flow-progress-bar { flex:1; height:8px; background:#E2E8F0; border-radius:8px; overflow:hidden; }
        .flow-progress-fill { height:100%; background:linear-gradient(90deg,#F97316,#10B981); border-radius:8px; transition:width 0.6s ease; }
        .flow-pct { font-size:0.8rem; font-weight:800; color:#F97316; min-width:32px; }
        .flow-spinner { width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#F97316; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .flow-steps { display:flex; flex-direction:column; gap:0; position:relative; }
        .flow-step { display:flex; gap:14px; align-items:flex-start; padding:10px 0; position:relative; }
        .flow-connector { position:absolute; left:19px; top:42px; width:2px; height:calc(100% - 4px); background:#E2E8F0; z-index:0; }
        .flow-connector.done { background:#10B981; }
        .step-icon-wrap { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; color:#fff; font-weight:900; flex-shrink:0; z-index:1; border:3px solid transparent; transition:all 0.3s; }
        .step-info { flex:1; padding-top:4px; }
        .step-num { font-size:0.7rem; font-weight:700; color:#94A3B8; text-transform:uppercase; letter-spacing:.05em; }
        .step-title { font-size:0.88rem; font-weight:700; color:#1E293B; margin:2px 0; }
        .flow-step.active .step-title { color:#F97316; }
        .step-date { font-size:0.75rem; color:#10B981; font-weight:600; margin-top:2px; }
        .step-current-label { font-size:0.75rem; color:#F97316; font-weight:700; margin-top:2px; }
      `}</style>
    </div>
  )
}
