import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Swipe from "./pages/Swipe";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { BottomNav } from "./components/BottomNav";
import { TopNav } from "./components/TopNav";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="app-frame">
        <TopNav />
        <main className="relative z-10 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Auth initialMode="login" />} />
      <Route path="/register" element={<Auth initialMode="register" />} />
      <Route element={<ProtectedLayout />}> 
        <Route path="/home" element={<Dashboard />} />
        <Route path="/discover" element={<Swipe />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
