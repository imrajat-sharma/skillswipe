import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Matches from "./pages/Matches";
import Notifications from "./pages/Notifications";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Swipe from "./pages/Swipe";
import "./App.css";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return <Navigate to={user.isProfileComplete ? "/feed" : "/onboarding"} replace />;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Auth initialMode="login" />} />
      <Route path="/register" element={<Auth initialMode="register" />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Dashboard />} />
        <Route path="/create" element={<Dashboard />} />
        <Route path="/discover" element={<Swipe />} />
        <Route path="/activity" element={<Notifications />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Navigate to="/activity" replace />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
