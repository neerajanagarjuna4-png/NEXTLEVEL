import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-navbar">
      <div className="nav-left">
        <NavLink to="/dashboard" className="brand">NEXT_LEVEL</NavLink>
        <nav className="top-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          {user && user.role === 'student' && (
            <>
              <NavLink to="/planner" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Planner</NavLink>
              <NavLink to="/flashcards" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Flashcards</NavLink>
              <NavLink to="/pyq" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>PYQ</NavLink>
            </>
          )}
          <NavLink to="/stories" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Stories</NavLink>
        </nav>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-block">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Sign up</NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
