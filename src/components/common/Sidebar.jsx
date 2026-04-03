import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink></li>
          <li><NavLink to="/syllabus" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Syllabus</NavLink></li>
          <li><NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Tasks</NavLink></li>
          <li><NavLink to="/planner" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Planner</NavLink></li>
          <li><NavLink to="/flashcards" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Flashcards</NavLink></li>
          <li><NavLink to="/pyq" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>PYQ Tracker</NavLink></li>
          <li><NavLink to="/mock-test" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Mock Test</NavLink></li>
          <li><NavLink to="/notes" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Notes</NavLink></li>
          <li><NavLink to="/focus" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Focus</NavLink></li>
          <li><NavLink to="/report-card" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Report Card</NavLink></li>
          <li><NavLink to="/leaderboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Leaderboard</NavLink></li>
          <li><NavLink to="/stories" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Stories</NavLink></li>
          <li><NavLink to="/partnership" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Partnerships</NavLink></li>
          <li><NavLink to="/mentor-profile" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Mentor Profile</NavLink></li>
          <li><NavLink to="/feedback" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Feedback</NavLink></li>
        </ul>
      </nav>
      <div className="sidebar-footer" style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
