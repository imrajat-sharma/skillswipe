import { Compass, LogIn, MoonStar, Sparkles, Sun, Users } from "lucide-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Swipe from "./pages/Swipe";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import { Button } from "./components/Button";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

function OnboardingScreen() {
  const { googleAuthUrl, user, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!loading && user) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <main className="auth-scene px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
        <section className="hero-panel relative rounded-[2rem] p-6 md:p-8 lg:p-10">
          <div className="absolute right-6 top-6">
            <button type="button" onClick={toggleTheme} className="icon-toggle">
              {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
            </button>
          </div>

          <div className="max-w-2xl">
            <div className="section-label">SkillSwipe live client</div>
            <h1 className="hero-title mt-4">The social layer of building, with a swipe engine underneath.</h1>
            <p className="hero-copy mt-5 max-w-xl">
              SkillSwipe blends the social rhythm of Instagram and Facebook with Tinder-style discovery, so people can
              post what they are building, match on intent, and move quickly into conversation.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Home feed",
                copy: "Publish text, image, and poll posts and stay close to network momentum.",
              },
              {
                icon: Compass,
                title: "SwipeConnect",
                copy: "Discover builders, mentors, and collaborators with ranked profile matching.",
              },
              {
                icon: Users,
                title: "Matches + chat",
                copy: "Turn mutual interest into direct conversations powered by the live backend.",
              },
            ].map((item) => (
              <article key={item.title} className="feature-glass">
                <item.icon size={18} />
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="hero-ribbon mt-8">
            <span>Inspired by Facebook, Instagram, and Tinder</span>
            <span>Responsive by default</span>
            <span>Session-based auth</span>
            <span>Live API integration</span>
          </div>
        </section>

        <section className="hero-panel rounded-[2rem] p-6 md:p-8 lg:p-10">
          <div className="section-label">Start here</div>
          <h2 className="h2 mt-4">Create your network presence and begin matching</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Email auth and Google auth are wired to the backend. Once signed in, you can complete your profile, post to
            the feed, browse matches, and message people directly.
          </p>

          <div className="mt-6 grid gap-3">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full justify-center">
                Create account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full justify-center">
                <LogIn size={16} />
                Sign in with email
              </Button>
            </Link>
            <a href={googleAuthUrl}>
              <Button variant="ghost" size="lg" className="w-full justify-center border border-[var(--border-soft)] bg-white/70 dark:bg-white/5">
                Continue with Google
              </Button>
            </a>
          </div>

          <div className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">What the frontend now covers</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Feed, create post, comments, likes, share actions, discover filters, match browsing, chat, profile
                editing, notifications, settings, and dark mode.
              </p>
            </div>
            <p className="rounded-[1rem] bg-[var(--surface)] px-4 py-3 text-xs leading-6 text-[var(--text-muted)]">
              Account deactivation and deletion controls are shown in settings, but the current backend does not expose
              endpoints for those actions yet.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Navigate to={user ? "/discover" : "/onboarding"} replace />;
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
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/login" element={<Auth initialMode="login" />} />
      <Route path="/register" element={<Auth initialMode="register" />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Dashboard />} />
        <Route path="/create" element={<Dashboard />} />
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
