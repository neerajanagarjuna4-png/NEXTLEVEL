import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSyllabusByBranch } from '../../services/syllabusData';
import ProgressBar from '../common/ProgressBar';
import './SyllabusChecklist.css';

const SyllabusChecklist = ({ userId, branch }) => {
  const [syllabus, setSyllabus] = useState(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [expandedSubjects, setExpandedSubjects] = useState({});

  useEffect(() => {
    if (branch) {
      const branchSyllabus = getSyllabusByBranch(branch);
      setSyllabus(branchSyllabus);
      fetchProgress(branchSyllabus);
    }
  }, [branch]);

  const fetchProgress = async (syllabusData) => {
    try {
      const response = await axios.get(`/api/student/syllabus-progress/${userId}`);
      const savedProgress = response.data;
      
      // Merge saved progress with syllabus structure
      const updatedSyllabus = mergeProgress(syllabusData, savedProgress);
      setSyllabus(updatedSyllabus);
      calculateProgress(updatedSyllabus);
    } catch (error) {
      console.error('Error fetching syllabus progress:', error);
    }
  };

  const mergeProgress = (syllabusData, savedProgress) => {
    // Deep merge logic here
    return syllabusData;
  };

  const calculateProgress = (syllabusData) => {
    let total = 0;
    let completed = 0;
    
    const countTopics = (subjects) => {
      subjects.forEach(subject => {
        subject.topics.forEach(topic => {
          topic.subtopics.forEach(subtopic => {
            total++;
            if (subtopic.completed) completed++;
          });
        });
      });
    };

    countTopics(syllabusData.subjects);
    setProgress({ completed, total });
  };

  const toggleSubtopic = async (subjectIndex, topicIndex, subtopicIndex) => {
    const updatedSyllabus = { ...syllabus };
    const subtopic = updatedSyllabus.subjects[subjectIndex]
      .topics[topicIndex]
      .subtopics[subtopicIndex];
    
    subtopic.completed = !subtopic.completed;
    
    // Auto-update topic completion if all subtopics are done
    const topic = updatedSyllabus.subjects[subjectIndex].topics[topicIndex];
    topic.completed = topic.subtopics.every(st => st.completed);
    
    setSyllabus(updatedSyllabus);
    calculateProgress(updatedSyllabus);
    
    // Save progress to backend
    try {
      await axios.post(`/api/student/syllabus-progress/${userId}`, {
        subjectIndex,
        topicIndex,
        subtopicIndex,
        completed: subtopic.completed
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleSubject = (subjectIndex) => {
    setExpandedSubjects({
      ...expandedSubjects,
      [subjectIndex]: !expandedSubjects[subjectIndex]
    });
  };

  if (!syllabus) return <div>Loading syllabus...</div>;

  return (
    <div className="syllabus-checklist">
      <h3>Syllabus Progress</h3>
      
      <div className="syllabus-progress-summary">
        <ProgressBar 
          progress={(progress.completed / progress.total) * 100}
          label={`${Math.round((progress.completed / progress.total) * 100)}% Completed`}
        />
        <div className="topic-stats">
          <span>Completed Topics: {progress.completed}</span>
          <span>Remaining Topics: {progress.total - progress.completed}</span>
        </div>
      </div>

      <div className="subjects-container">
        {syllabus.subjects.map((subject, sIdx) => (
          <div key={sIdx} className={`subject-card priority-${subject.priority}`}>
            <div 
              className="subject-header"
              onClick={() => toggleSubject(sIdx)}
            >
              <div className="subject-info">
                <span className="subject-name">{subject.name}</span>
                <span className="subject-priority">
                  {subject.priority === 'high' ? 'High Priority' : 
                   subject.priority === 'medium' ? 'Medium Priority' : 'Supporting'}
                </span>
              </div>
              <span className="expand-icon">
                {expandedSubjects[sIdx] ? '▼' : '▶'}
              </span>
            </div>

            {expandedSubjects[sIdx] && (
              <div className="topics-container">
                {subject.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="topic-item">
                    <div className="topic-header">
                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() => {
                          // Toggle all subtopics
                          topic.subtopics.forEach((_, stIdx) => {
                            toggleSubtopic(sIdx, tIdx, stIdx);
                          });
                        }}
                      />
                      <span className="topic-name">{topic.name}</span>
                    </div>
                    
                    <div className="subtopics-list">
                      {topic.subtopics.map((subtopic, stIdx) => (
                        <div key={stIdx} className="subtopic-item">
                          <input
                            type="checkbox"
                            checked={subtopic.completed}
                            onChange={() => toggleSubtopic(sIdx, tIdx, stIdx)}
                          />
                          <span className="subtopic-name">{subtopic.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusChecklist;