import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { connectSocket, disconnectSocket } from '../utils/socket.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingApproval, setPendingApproval] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      // persist user & axios auth header so other tabs and hooks can access them
      try { localStorage.setItem('user', JSON.stringify(response.data.user)); } catch (e) {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try { connectSocket(response.data.user); } catch (e) { console.warn('Socket connect failed', e); }
      console.log('AuthContext.fetchUser: fetched user', response.data.user?._id || response.data.user?.email);
      setPendingApproval(response.data.user.status === 'pending');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      console.warn('AuthContext.fetchUser: failed to fetch user', error && error.message ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      try { localStorage.setItem('user', JSON.stringify(response.data.user)); } catch (e) {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      try { connectSocket(response.data.user); } catch (e) { console.warn('Socket connect failed', e); }
      setPendingApproval(response.data.user.status === 'pending');
      console.log('AuthContext.login: stored token and user for', response.data.user?._id || response.data.user?.email);
      return { success: true };
    } catch (error) {
      console.warn('AuthContext.login: login failed', error && error.response?.data?.message ? error.response.data.message : error && error.message ? error.message : error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      return { success: true, message: 'Registration successful. Awaiting approval.' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    try { disconnectSocket(); } catch (e) { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setPendingApproval(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      pendingApproval,
      login,
      signup,
      logout,
      fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};