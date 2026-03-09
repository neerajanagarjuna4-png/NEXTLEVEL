import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PreparationTracker.css';

const PreparationTracker = ({ userId }) => {
  const [targets, setTargets] = useState({
    daily: 6,
    weekly: 42,
    monthly: 180
  });
  
  const [progress, setProgress] = useState({
    today: 4.5,
    week: 28,
    month: 120,
    dailyTrend: [3.5, 4, 4.5, 5, 4.8, 4.2, 4.5],
    weeklyTrend: [25, 28, 30, 28, 32, 29, 28]
  });

  const [editing, setEditing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchTargets();
    fetchProgress();
  }, [userId]);

  const fetchTargets = async () => {
    try {
      const response = await axios.get(`/api/student/targets/${userId}`);
      if (response.data) setTargets(response.data);
    } catch (error) {
      console.error('Error fetching targets:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/api/student/progress/${userId}`);
      if (response.data) setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateTargets = async () => {
    try {
      await axios.post(`/api/student/targets/${userId}`, targets);
      setEditing(false);
    } catch (error) {
      console.error('Error updating targets:', error);
    }
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="preparation-tracker-enhanced">
      <div className="tracker-header">
        <div className="header-left">
          <h3>📊 Preparation Targets</h3>
          <p className="tracker-subtitle">Track your daily, weekly & monthly goals</p>
        </div>
        <button 
          className={`edit-btn ${editing ? 'cancel' : ''}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? '✕ Cancel' : '✎ Edit Targets'}
        </button>
      </div>

      <div className="targets-showcase">
        {/* Daily Target Card */}
        <div 
          className={`target-card ${hoveredCard === 'daily' ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard('daily')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-header">
            <span className="target-icon">🌅</span>
            <h4>Daily Goal</h4>
          </div>
          
          <div className="target-display">
            {editing ? (
              <input
                type="number"
                value={targets.daily}
                onChange={(e) => setTargets({...targets, daily: parseFloat(e.target.value)})}
                min="1"
                max="24"
                step="0.5"
                className="target-input"
              />
            ) : (
              <div className="current-progress">
                <span className="progress-value">{progress.today}</span>
                <span className="progress-separator">/</span>
                <span className="target-value">{targets.daily}</span>
                <span className="unit">hrs</span>
              </div>
            )}
          </div>

          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(progress.today / targets.daily) * 100}%`,
                  background: `linear-gradient(90deg, ${getProgressColor(progress.today, targets.daily)}, #3b82f6)`
                }}
              >
                <span className="progress-tooltip">
                  {((progress.today / targets.daily) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <span className="remaining">
              {targets.daily - progress.today > 0 
                ? `${(targets.daily - progress.today).toFixed(1)} hrs left` 
                : '✓ Target achieved!'}
            </span>
            {hoveredCard === 'daily' && (
              <div className="mini-chart">
                {progress.dailyTrend.map((val, i) => (
                  <div 
                    key={i} 
                    className="chart-bar"
                    style={{ height: `${val * 8}px` }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Target Card */}
        <div 
          className={`target-card ${hoveredCard === 'weekly' ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard('weekly')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-header">
            <span className="target-icon">📅</span>
            <h4>Weekly Goal</h4>
          </div>
          
          <div className="target-display">
            {editing ? (
              <input
                type="number"
                value={targets.weekly}
                onChange={(e) => setTargets({...targets, weekly: parseFloat(e.target.value)})}
                min="1"
                max="168"
                step="1"
                className="target-input"
              />
            ) : (
              <div className="current-progress">
                <span className="progress-value">{progress.week}</span>
                <span className="progress-separator">/</span>
                <span className="target-value">{targets.weekly}</span>
                <span className="unit">hrs</span>
              </div>
            )}
          </div>

          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(progress.week / targets.weekly) * 100}%`,
                  background: `linear-gradient(90deg, ${getProgressColor(progress.week, targets.weekly)}, #8b5cf6)`
                }}
              >
                <span className="progress-tooltip">
                  {((progress.week / targets.weekly) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <span className="remaining">
              {targets.weekly - progress.week > 0 
                ? `${(targets.weekly - progress.week).toFixed(1)} hrs left` 
                : '✓ Target achieved!'}
            </span>
            {hoveredCard === 'weekly' && (
              <div className="mini-chart">
                {progress.weeklyTrend.map((val, i) => (
                  <div 
                    key={i} 
                    className="chart-bar"
                    style={{ height: `${val * 1.5}px` }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Target Card */}
        <div 
          className={`target-card ${hoveredCard === 'monthly' ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard('monthly')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-header">
            <span className="target-icon">📆</span>
            <h4>Monthly Goal</h4>
          </div>
          
          <div className="target-display">
            {editing ? (
              <input
                type="number"
                value={targets.monthly}
                onChange={(e) => setTargets({...targets, monthly: parseFloat(e.target.value)})}
                min="1"
                max="744"
                step="1"
                className="target-input"
              />
            ) : (
              <div className="current-progress">
                <span className="progress-value">{progress.month}</span>
                <span className="progress-separator">/</span>
                <span className="target-value">{targets.monthly}</span>
                <span className="unit">hrs</span>
              </div>
            )}
          </div>

          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(progress.month / targets.monthly) * 100}%`,
                  background: `linear-gradient(90deg, ${getProgressColor(progress.month, targets.monthly)}, #ec4899)`
                }}
              >
                <span className="progress-tooltip">
                  {((progress.month / targets.monthly) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <span className="remaining">
              {targets.monthly - progress.month > 0 
                ? `${(targets.monthly - progress.month).toFixed(1)} hrs left` 
                : '✓ Target achieved!'}
            </span>
            <span className="days-remaining">
              {Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()))} days left
            </span>
          </div>
        </div>
      </div>

      {editing && (
        <div className="edit-actions">
          <button className="save-targets-btn" onClick={updateTargets}>
            💾 Save All Targets
          </button>
          <button className="reset-btn" onClick={() => setEditing(false)}>
            ↩ Cancel
          </button>
        </div>
      )}

      {/* Achievement Message */}
      {!editing && (
        <div className="achievement-message">
          {progress.today >= targets.daily && progress.week >= targets.weekly && progress.month >= targets.monthly ? (
            <p className="success-message">🎉 Congratulations! You've achieved all your targets! Keep up the amazing work!</p>
          ) : progress.today >= targets.daily ? (
            <p className="info-message">✅ Daily target achieved! {targets.daily - progress.today <= 0 ? 'Time to relax!' : 'Keep going!'}</p>
          ) : (
            <p className="motivation-message">💪 You're {((progress.today / targets.daily) * 100).toFixed(1)}% through today's target. Stay focused!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PreparationTracker;