import { useState, useEffect } from 'react'
import axios from 'axios'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import './ProgressVisualization.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

function ProgressVisualization({ branch, fullView }) {
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
  const buildChartData = () => {
    const last14 = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      
      const report = reports.find(r => {
        const rDate = new Date(r.date).toISOString().split('T')[0]
        return rDate === dateStr
      })

      last14.push({
        label: dayName,
        hours: report?.studyHours || 0,
        pyqs: report?.pyqsSolved || 0,
        accuracy: report?.accuracy || 0
      })
    }
    return last14
  }

  const chartData = buildChartData()
  const totalHours = reports.reduce((sum, r) => sum + (r.studyHours || 0), 0)
  const totalPYQs = reports.reduce((sum, r) => sum + (r.pyqsSolved || 0), 0)
  const avgAccuracy = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + (r.accuracy || 0), 0) / reports.length) 
    : 0

  const lineConfig = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: 'Study Hours',
        data: chartData.map(d => d.hours),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 3
      },
      {
        label: 'PYQs Solved',
        data: chartData.map(d => d.pyqs),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 3
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 11, weight: 700 } } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } }
    }
  }

  // Doughnut for subject distribution
  const subjectMap = {}
  reports.forEach(r => {
    if (r.subject) {
      subjectMap[r.subject] = (subjectMap[r.subject] || 0) + (r.studyHours || 0)
    }
  })
  const subjectLabels = Object.keys(subjectMap)
  const subjectHours = Object.values(subjectMap)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  const doughnutData = {
    labels: subjectLabels.length > 0 ? subjectLabels : ['No data'],
    datasets: [{
      data: subjectHours.length > 0 ? subjectHours : [1],
      backgroundColor: subjectLabels.length > 0 ? colors.slice(0, subjectLabels.length) : ['#e2e8f0'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

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

      {/* Line Chart */}
      <div style={{ height: fullView ? '350px' : '250px', marginBottom: '20px' }}>
        <Line data={lineConfig} options={lineOptions} />
      </div>

      {/* Subject Distribution */}
      {fullView && subjectLabels.length > 0 && (
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textAlign: 'center', marginBottom: '12px' }}>📊 Subject Distribution</h4>
          <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }} />
        </div>
      )}
    </div>
  )
}

export default ProgressVisualization
