import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import './MentorDashboard.css';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [analytics, setAnalytics] = useState({
    totalStudents: 156,
    activeToday: 89,
    avgConsistency: 76,
    atRiskCount: 23,
    topPerformers: 12,
    pendingApprovals: 8
  });

  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/mentor/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/mentor/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getStudentStatus = (student) => {
    if (student.consistencyScore < 50) return 'at-risk';
    if (student.consistencyScore < 70) return 'needs-attention';
    if (student.consistencyScore >= 85) return 'excellent';
    return 'on-track';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || getStudentStatus(student) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const COLORS = {
    'excellent': '#10b981',
    'on-track': '#3b82f6',
    'needs-attention': '#f59e0b',
    'at-risk': '#ef4444'
  };

  return (
    <div className="mentor-dashboard-premium">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Mentor Dashboard</h1>
          <p className="welcome-text">Welcome back, Bhima Sankar Sir</p>
        </div>
        <div className="header-right">
          <div className="date-badge">
            <span className="date-icon">📅</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="notification-badge">
            <span className="notification-icon">🔔</span>
            <span className="notification-count">12</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card gradient-blue">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <span className="metric-value">{analytics.totalStudents}</span>
            <span className="metric-label">Total Students</span>
          </div>
          <div className="metric-trend positive">+12 this month</div>
        </div>

        <div className="metric-card gradient-green">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <span className="metric-value">{analytics.activeToday}</span>
            <span className="metric-label">Active Today</span>
          </div>
          <div className="metric-trend positive">{((analytics.activeToday/analytics.totalStudents)*100).toFixed(0)}% active</div>
        </div>

        <div className="metric-card gradient-orange">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <span className="metric-value">{analytics.avgConsistency}%</span>
            <span className="metric-label">Avg Consistency</span>
          </div>
          <div className="metric-trend positive">↑5% vs last week</div>
        </div>

        <div className="metric-card gradient-red">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <span className="metric-value">{analytics.atRiskCount}</span>
            <span className="metric-label">At Risk Students</span>
          </div>
          <div className="metric-trend negative">Need attention</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Student Activity Overview</h3>
            <div className="chart-actions">
              <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>Week</button>
              <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>Month</button>
              <button className={timeRange === 'year' ? 'active' : ''} onClick={() => setTimeRange('year')}>Year</button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[
                { day: 'Mon', active: 65, studying: 45, completed: 35 },
                { day: 'Tue', active: 78, studying: 52, completed: 42 },
                { day: 'Wed', active: 82, studying: 58, completed: 48 },
                { day: 'Thu', active: 75, studying: 55, completed: 45 },
                { day: 'Fri', active: 88, studying: 62, completed: 52 },
                { day: 'Sat', active: 92, studying: 68, completed: 58 },
                { day: 'Sun', active: 70, studying: 48, completed: 38 }
              ]}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStudying" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="studying" stroke="#10b981" fillOpacity={1} fill="url(#colorStudying)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Student Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Excellent', value: 12, color: '#10b981' },
                    { name: 'On Track', value: 45, color: '#3b82f6' },
                    { name: 'Needs Attention', value: 28, color: '#f59e0b' },
                    { name: 'At Risk', value: 15, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {['Excellent', 'On Track', 'Needs Attention', 'At Risk'].map((status, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-color" style={{ background: COLORS[status.toLowerCase().replace(' ', '-')] }}></span>
                  <span className="legend-label">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {analytics.pendingApprovals > 0 && (
        <div className="pending-approvals">
          <div className="approvals-header">
            <h3>⏳ Pending Approvals</h3>
            <span className="pending-count">{analytics.pendingApprovals} new requests</span>
          </div>
          <div className="approvals-list">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="approval-item">
                <div className="student-info">
                  <div className="student-avatar">👤</div>
                  <div>
                    <h4>Rahul Sharma</h4>
                    <p>ECE - Requested 2 hours ago</p>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="approve-btn">✓ Approve</button>
                  <button className="reject-btn">✕ Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="student-list-section">
        <div className="list-header">
          <h3>All Students</h3>
          <div className="list-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="on-track">On Track</option>
              <option value="needs-attention">Needs Attention</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </div>

        <div className="students-grid">
          {filteredStudents.map((student, index) => (
            <div 
              key={index} 
              className={`student-card ${getStudentStatus(student)} ${selectedStudent?._id === student._id ? 'selected' : ''}`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="student-card-header">
                <div className="student-avatar-large">
                  {student.name.charAt(0)}
                </div>
                <div className="student-status" style={{ background: COLORS[getStudentStatus(student)] }}>
                  {getStudentStatus(student).replace('-', ' ')}
                </div>
              </div>
              
              <h4>{student.name}</h4>
              <p className="student-branch">{student.branch}</p>
              
              <div className="student-stats">
                <div className="stat">
                  <span className="stat-label">Consistency</span>
                  <span className="stat-value">{student.consistencyScore}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Syllabus</span>
                  <span className="stat-value">{student.syllabusProgress}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value">{student.streak} days</span>
                </div>
              </div>

              <div className="student-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${student.syllabusProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="student-footer">
                <span className="last-active">Last active: {student.lastActive}</span>
                <button className="view-details-btn">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Student Modal */}
      {selectedStudent && (
        <div className="student-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedStudent.name}</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="student-profile">
                <div className="profile-info">
                  <p><strong>Branch:</strong> {selectedStudent.branch}</p>
                  <p><strong>Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Joined:</strong> {selectedStudent.joinedDate}</p>
                </div>
                <div className="profile-stats">
                  <div className="stat-circle">
                    <span className="stat-number">{selectedStudent.consistencyScore}%</span>
                    <span className="stat-label">Consistency</span>
                  </div>
                  <div className="stat-circle">
                    <span className="stat-number">{selectedStudent.syllabusProgress}%</span>
                    <span className="stat-label">Syllabus</span>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-timeline">
                  {selectedStudent.recentActivity?.map((activity, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <p>{activity.description}</p>
                        <span className="timeline-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button className="send-message">💬 Send Message</button>
                <button className="schedule-call">📅 Schedule Call</button>
                <button className="view-report">📊 Full Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;