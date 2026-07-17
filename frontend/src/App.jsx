import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import PlaceholderPage from './components/PlaceholderPage.jsx'
import Subjects from './pages/Subjects.jsx'
import PomodoroTimer from './pages/PomodoroTimer.jsx'

function isAuthenticated() {
  return Boolean(localStorage.getItem('token'))
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PlaceholderPage title="Dashboard" icon="📊" />} />
          <Route path="timer" element={<PomodoroTimer />} />
          <Route path="tasks" element={<PlaceholderPage title="Tasks" icon="✅" />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="achievements" element={<PlaceholderPage title="Achievements" icon="🏆" />} />
          <Route path="leaderboard" element={<PlaceholderPage title="Leaderboard" icon="👑" />} />
          <Route path="profile" element={<PlaceholderPage title="Profile" icon="👤" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" icon="⚙️" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
