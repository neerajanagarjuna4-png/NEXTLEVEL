import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getGATESyllabus } from '../../services/gateSyllabusData';
import { useAuth } from '../../context/AuthContext';
import './AdvancedSyllabusTracker.css';

const AdvancedSyllabusTracker = () => {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState(null);
  const [progress, setProgress] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [monthlyTarget, setMonthlyTarget] = useState(null);
  const [activeView, setActiveView] = useState('all');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [studyStats, setStudyStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    weeklyProgress: []
  });

  useEffect(() => {
    if (user?.branch) {
      const branchSyllabus = getGATESyllabus(user.branch);
      setSyllabus(branchSyllabus);
      fetchSavedProgress();
      loadMonthlyTarget();
    }
  }, [user?.branch]);

  const fetchSavedProgress = async () => {
    try {
      const response = await axios.get(`/api/student/syllabus-progress/${user._id}`);
      if (response.data) {
        setProgress(response.data);
        calculateStats(response.data, syllabus);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const loadMonthlyTarget = async () => {
    try {
      const response = await axios.get(`/api/student/monthly-target/${user._id}`);
      setMonthlyTarget(response.data);
    } catch (error) {
      console.error('Error loading monthly target:', error);
    }
  };

  const saveMonthlyTarget = async (target) => {
    try {
      await axios.post(`/api/student/monthly-target/${user._id}`, target);
      setMonthlyTarget(target);
    } catch (error) {
      console.error('Error saving monthly target:', error);
    }
  };

  const calculateStats = (progressData, syllabusData) => {
    if (!syllabusData) return;
    
    let completed = 0;
    let total = 0;
    
    // Count from engineering mathematics
    if (syllabusData.engineeringMathematics) {
      syllabusData.engineeringMathematics.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          total++;
          const key = `em_${topic.name}_${subtopic}`;
          if (progressData[key]) completed++;
        });
      });
    }
    
    // Count from core subjects
    syllabusData.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          total++;
          const key = `${subject.name}_${topic.name}_${subtopic}`;
          if (progressData[key]) completed++;
        });
      });
    });
    
    // Count from general aptitude
    if (syllabusData.generalAptitude) {
      syllabusData.generalAptitude.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          total++;
          const key = `ga_${topic.name}_${subtopic}`;
          if (progressData[key]) completed++;
        });
      });
    }
    
    const inProgress = Math.floor(total * 0.3); // Example calculation
    const pending = total - completed - inProgress;
    
    setStudyStats({
      completed,
      inProgress,
      pending,
      total,
      completionPercentage: ((completed / total) * 100).toFixed(1),
      weeklyProgress: generateWeeklyProgress(completed)
    });
  };

  const generateWeeklyProgress = (completed) => {
    // Generate last 7 days progress
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      weekly.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Math.floor(Math.random() * 5) + completed / 7 // Example data
      });
    }
    return weekly;
  };

  const toggleSubtopic = (section, subjectName, topicName, subtopic) => {
    const key = `${section}_${subjectName}_${topicName}_${subtopic}`;
    const newProgress = { ...progress, [key]: !progress[key] };
    setProgress(newProgress);
    calculateStats(newProgress, syllabus);
    
    // Save to backend
    axios.post(`/api/student/syllabus-progress/${user._id}`, {
      key,
      completed: newProgress[key],
      timestamp: new Date()
    }).catch(error => console.error('Error saving progress:', error));
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections({
      ...expandedSections,
      [sectionKey]: !expandedSections[sectionKey]
    });
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getRecommendations = useMemo(() => {
    if (!syllabus || !progress) return [];
    
    const recommendations = [];
    const incompleteTopics = [];
    
    // Find incomplete high-priority topics
    syllabus.subjects.forEach(subject => {
      if (subject.priority === 'high') {
        subject.topics.forEach(topic => {
          let topicCompleted = true;
          topic.subtopics.forEach(subtopic => {
            const key = `${subject.name}_${topic.name}_${subtopic}`;
            if (!progress[key]) {
              topicCompleted = false;
              incompleteTopics.push({
                subject: subject.name,
                topic: topic.name,
                subtopic,
                priority: subject.priority,
                weightage: subject.weightage
              });
            }
          });
        });
      }
    });
    
    // Generate recommendations
    if (incompleteTopics.length > 0) {
      recommendations.push({
        type: 'high-priority',
        message: `Focus on ${incompleteTopics[0].topic} - ${incompleteTopics[0].subtopic}`,
        details: 'This is a high-weightage topic'
      });
    }
    
    // Check if behind on monthly target
    if (monthlyTarget && studyStats.completionPercentage < monthlyTarget.target) {
      recommendations.push({
        type: 'target',
        message: `You're behind your monthly target by ${(monthlyTarget.target - studyStats.completionPercentage).toFixed(1)}%`,
        details: 'Increase daily study hours to catch up'
      });
    }
    
    return recommendations;
  }, [syllabus, progress, monthlyTarget, studyStats]);

  if (!syllabus) {
    return <div className="loading-syllabus">Loading GATE 2026 Syllabus...</div>;
  }

  return (
    <div className="advanced-syllabus-tracker">
      {/* Header with Branch Info */}
      <div className="syllabus-header">
        <div className="branch-info">
          <h2>GATE 2026 - {syllabus.branchName}</h2>
          <span className="branch-code">{syllabus.branchCode}</span>
        </div>
        <div className="header-actions">
          <button 
            className={`view-toggle ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => setActiveView('all')}
          >
            Complete Syllabus
          </button>
          <button 
            className={`view-toggle ${activeView === 'priority' ? 'active' : ''}`}
            onClick={() => setActiveView('priority')}
          >
            Priority Wise
          </button>
          <button 
            className={`view-toggle ${activeView === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveView('progress')}
          >
            My Progress
          </button>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="progress-overview">
        <div className="progress-card main-progress">
          <h3>Syllabus Completion</h3>
          <div className="circular-progress">
            <svg viewBox="0 0 100 100">
              <circle className="progress-bg" cx="50" cy="50" r="45"/>
              <circle 
                className="progress-bar" 
                cx="50" 
                cy="50" 
                r="45"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - studyStats.completionPercentage / 100)}`}
              />
              <text x="50" y="50" textAnchor="middle" dy=".3em" className="progress-text">
                {studyStats.completionPercentage}%
              </text>
            </svg>
          </div>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-value">{studyStats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">{studyStats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat">
              <span className="stat-value">{studyStats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        <div className="progress-card monthly-target">
          <h3>Monthly Target</h3>
          <div className="target-input">
            <input 
              type="number" 
              placeholder="Set % target"
              value={monthlyTarget?.target || ''}
              onChange={(e) => setMonthlyTarget({...monthlyTarget, target: e.target.value})}
              onBlur={() => monthlyTarget && saveMonthlyTarget(monthlyTarget)}
            />
            <span>% completion by month end</span>
          </div>
          <div className="target-progress">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${(studyStats.completionPercentage / (monthlyTarget?.target || 100)) * 100}%` }}
              ></div>
            </div>
            <div className="target-stats">
              <span>Current: {studyStats.completionPercentage}%</span>
              <span>Target: {monthlyTarget?.target || 0}%</span>
            </div>
          </div>
        </div>

        <div className="progress-card weekly-progress">
          <h3>Weekly Activity</h3>
          <div className="weekly-chart">
            {studyStats.weeklyProgress.map((day, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar"
                  style={{ height: `${day.completed}px` }}
                ></div>
                <span className="day-label">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      {showRecommendations && getRecommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>🎯 Smart Recommendations</h3>
          <div className="recommendations-list">
            {getRecommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.type}`}>
                <div className="rec-icon">
                  {rec.type === 'high-priority' ? '⚡' : '🎯'}
                </div>
                <div className="rec-content">
                  <p className="rec-message">{rec.message}</p>
                  <p className="rec-details">{rec.details}</p>
                </div>
                <button className="rec-action">Start Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Mathematics Section */}
      {syllabus.engineeringMathematics && (
        <div className="syllabus-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('engineeringMath')}
          >
            <div className="section-title">
              <span className="expand-icon">
                {expandedSections.engineeringMath ? '▼' : '▶'}
              </span>
              <h3>{syllabus.engineeringMathematics.name}</h3>
              <span className="weightage-badge">
                {syllabus.engineeringMathematics.weightage}
              </span>
            </div>
            <div className="section-progress">
              <div className="mini-progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: '45%' }}
                ></div>
              </div>
              <span className="priority-tag high">High Priority</span>
            </div>
          </div>

          {expandedSections.engineeringMath && (
            <div className="section-content">
              {syllabus.engineeringMathematics.topics.map((topic, tIdx) => (
                <div key={tIdx} className="topic-container">
                  <div className="topic-header">
                    <h4>{topic.name}</h4>
                    <span className="topic-weightage">{topic.weightage}</span>
                  </div>
                  <div className="subtopics-grid">
                    {topic.subtopics.map((subtopic, sIdx) => {
                      const key = `em_${topic.name}_${subtopic}`;
                      return (
                        <div 
                          key={sIdx} 
                          className={`subtopic-item ${progress[key] ? 'completed' : ''}`}
                          onClick={() => toggleSubtopic('em', topic.name, '', subtopic)}
                        >
                          <input 
                            type="checkbox" 
                            checked={progress[key] || false}
                            onChange={() => {}}
                          />
                          <span className="subtopic-name">{subtopic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Core Subjects */}
      {syllabus.subjects.map((subject, sIdx) => (
        <div 
          key={sIdx} 
          className={`syllabus-section ${getPriorityClass(subject.priority)}`}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection(`subject_${sIdx}`)}
          >
            <div className="section-title">
              <span className="expand-icon">
                {expandedSections[`subject_${sIdx}`] ? '▼' : '▶'}
              </span>
              <h3>{subject.name}</h3>
              <span className="weightage-badge">{subject.weightage}</span>
            </div>
            <div className="section-progress">
              <div className="mini-progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: '35%' }}
                ></div>
              </div>
              <span className={`priority-tag ${subject.priority}`}>
                {subject.priority === 'high' ? '⚡ High Priority' : 
                 subject.priority === 'medium' ? '📌 Medium Priority' : '📚 Supporting'}
              </span>
            </div>
          </div>

          {expandedSections[`subject_${sIdx}`] && (
            <div className="section-content">
              {subject.topics.map((topic, tIdx) => (
                <div key={tIdx} className="topic-container">
                  <div className="topic-header">
                    <h4>{topic.name}</h4>
                    {topic.weightage && (
                      <span className="topic-weightage">{topic.weightage}</span>
                    )}
                  </div>
                  <div className="subtopics-grid">
                    {topic.subtopics.map((subtopic, stIdx) => {
                      const key = `${subject.name}_${topic.name}_${subtopic}`;
                      return (
                        <div 
                          key={stIdx} 
                          className={`subtopic-item ${progress[key] ? 'completed' : ''}`}
                          onClick={() => toggleSubtopic('core', subject.name, topic.name, subtopic)}
                        >
                          <input 
                            type="checkbox" 
                            checked={progress[key] || false}
                            onChange={() => {}}
                          />
                          <span className="subtopic-name">{subtopic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* General Aptitude Section */}
      {syllabus.generalAptitude && (
        <div className="syllabus-section aptitude-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('aptitude')}
          >
            <div className="section-title">
              <span className="expand-icon">
                {expandedSections.aptitude ? '▼' : '▶'}
              </span>
              <h3>{syllabus.generalAptitude.name}</h3>
              <span className="weightage-badge">{syllabus.generalAptitude.weightage}</span>
            </div>
            <div className="section-progress">
              <div className="mini-progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: '25%' }}
                ></div>
              </div>
              <span className="priority-tag high">Scoring Section</span>
            </div>
          </div>

          {expandedSections.aptitude && (
            <div className="section-content">
              {syllabus.generalAptitude.topics.map((topic, tIdx) => (
                <div key={tIdx} className="topic-container">
                  <div className="topic-header">
                    <h4>{topic.name}</h4>
                  </div>
                  <div className="subtopics-grid">
                    {topic.subtopics.map((subtopic, sIdx) => {
                      const key = `ga_${topic.name}_${subtopic}`;
                      return (
                        <div 
                          key={sIdx} 
                          className={`subtopic-item ${progress[key] ? 'completed' : ''}`}
                          onClick={() => toggleSubtopic('ga', topic.name, '', subtopic)}
                        >
                          <input 
                            type="checkbox" 
                            checked={progress[key] || false}
                            onChange={() => {}}
                          />
                          <span className="subtopic-name">{subtopic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Summary Footer */}
      <div className="syllabus-footer">
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Topics:</span>
            <span className="summary-value">{syllabus.totalTopics}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Subtopics:</span>
            <span className="summary-value">{syllabus.totalSubtopics}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completed:</span>
            <span className="summary-value">{studyStats.completed}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Remaining:</span>
            <span className="summary-value">{studyStats.pending}</span>
          </div>
        </div>
        <div className="footer-message">
          <p>🎯 Complete {studyStats.pending} more subtopics to reach 75% completion</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSyllabusTracker;