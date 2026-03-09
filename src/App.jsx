import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import PendingApproval from './pages/PendingApproval.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import MentorDashboard from './pages/MentorDashboard.jsx'
import MentorProfilePage from './pages/MentorProfilePage.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import MentorLogin from './pages/MentorLogin.jsx'

function App() {
  // Global Session Manager: Redirects based on role and presence of 'user' in localStorage
  const getInitialRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return <Navigate to="/login" replace />
    return user.role === 'mentor' ? <Navigate to="/mentor-dashboard" replace /> : <Navigate to="/dashboard" replace />
  }

  // Redirect if user tries to access login/signup while already logged in
  const PublicRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) return user.role === 'mentor' ? <Navigate to="/mentor-dashboard" replace /> : <Navigate to="/dashboard" replace />
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getInitialRoute()} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/mentor-login" element={<PublicRoute><MentorLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/mentor-profile" element={<MentorProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
