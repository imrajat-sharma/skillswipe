import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Loader from './components/Loader';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Loading SkillSwipe" fullScreen variant="auth" />;
  }

  const needsProfile = user && !user.isProfileComplete && location.pathname !== '/profile';

  if (needsProfile) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/swipe" element={<Swipe />} />
        <Route path="/matches" element={<Matches />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default App;
