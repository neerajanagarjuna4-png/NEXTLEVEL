import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import './ProgressVisualization.css'

function ProgressVisualization({ fullView }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user._id && token) fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      // Fetch last 30 days of reports
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)

      const res = await axios.get(`/api/student/study-reports/${user._id}`, {
        params: { start: start.toISOString(), end: end.toISOString() },
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data.reports || [])
    } catch (err) {
      console.error('Failed to fetch reports for charts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Build chart data from reports
  const chartData = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    
    const report = reports.find(r => {
      const rDate = new Date(r.date).toISOString().split('T')[0]
      return rDate === dateStr
    })

    chartData.push({
      name: dayName,
      hours: report?.studyHours || 0,
      pyqs: report?.pyqsSolved || 0,
      accuracy: report?.accuracy || 0
    })
  }

  const totalHours = reports.reduce((sum, r) => sum + (r.studyHours || 0), 0)
  const totalPYQs = reports.reduce((sum, r) => sum + (r.pyqsSolved || 0), 0)
  const avgAccuracy = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + (r.accuracy || 0), 0) / reports.length) 
    : 0

  // Subject distribution for Pie Chart
  const subjectMap = {}
  reports.forEach(r => {
    if (r.subject) {
      subjectMap[r.subject] = (subjectMap[r.subject] || 0) + (r.studyHours || 0)
    }
  })
  const pieData = Object.keys(subjectMap).map(key => ({
    name: key,
    value: subjectMap[key]
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  if (loading) return <div className="progress-viz"><p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading charts...</p></div>

  return (
    <div className="progress-viz">
      <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px' }}>📈 Progress Visualization</h3>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="summary-card" style={{ flex: 1, minWidth: '100px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>30-Day Hours</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3b82f6' }}>{totalHours.toFixed(1)}</div>
        </div>
        <div className="summary-card" style={{ flex: 1, minWidth: '100px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Total PYQs</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>{totalPYQs}</div>
        </div>
        <div className="summary-card" style={{ flex: 1, minWidth: '100px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Avg Accuracy</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>{avgAccuracy}%</div>
        </div>
        <div className="summary-card" style={{ flex: 1, minWidth: '100px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Reports</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#8b5cf6' }}>{reports.length}</div>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ width: '100%', height: fullView ? 350 : 250, marginBottom: '20px' }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPYQs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 700, fontSize: '12px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
            <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" name="Study Hours" />
            <Area type="monotone" dataKey="pyqs" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPYQs)" name="PYQs Solved" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Distribution */}
      {fullView && pieData.length > 0 && (
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textAlign: 'center', marginBottom: '12px' }}>📊 Subject Distribution</h4>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 700, fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default ProgressVisualization
