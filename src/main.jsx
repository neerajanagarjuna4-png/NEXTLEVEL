import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// Set globally so all relative /api calls automatically route to the backend in production
// Only set baseURL when a non-empty VITE_API_URL is provided — an empty string breaks URL construction.
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

// Initialize theme from localStorage so UI matches user's preference on load
try {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
} catch (e) {
  // ignore (e.g., during server-side rendering or restricted environments)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    />
  </React.StrictMode>
)
