import {
  Bell,
  Compass,
  Home,
  LogOut,
  MessageSquare,
  MoonStar,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Avatar } from "./Avatar";

const navItems = [
  { to: "/feed", label: "Home Feed", shortLabel: "Home", icon: Home },
  { to: "/discover", label: "SwipeConnect", shortLabel: "Swipe", icon: Compass },
  { to: "/matches", label: "Matches", shortLabel: "Matches", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", shortLabel: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", shortLabel: "Profile", icon: UserRound },
];

function AppShell() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      <div className="app-shell-grid">
        <aside className="app-sidebar hidden lg:flex">
          <div className="glass-panel flex h-full flex-col gap-6 rounded-[2rem] p-5">
            <div>
              <div className="brand-mark">SS</div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-soft)]">
                SkillSwipe
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[var(--text-strong)]">
                Network through context, not cold intros.
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                A social feed, a discover engine, and a focused match inbox in one place.
              </p>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">Daily swipes</p>
              <p className="mt-3 text-4xl font-bold text-[var(--text-strong)]">{user?.swipesLeftToday ?? 0}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">left in today’s discover window</p>
            </div>

            <div className="mt-auto space-y-3">
              <button type="button" onClick={toggleTheme} className="sidebar-utility">
                {isDark ? <Sun size={17} /> : <MoonStar size={17} />}
                <span>{isDark ? "Light mode" : "Dark mode"}</span>
              </button>
              <NavLink to="/settings" className="sidebar-utility">
                <Settings size={17} />
                <span>Settings</span>
              </NavLink>
              <button type="button" onClick={handleLogout} className="sidebar-utility">
                <LogOut size={17} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="relative min-w-0">
          <header className="page-topbar glass-panel">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={user?.name} image={user?.photo} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{user?.name || "SkillSwipe"}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {user?.isProfileComplete ? "Profile live in SwipeConnect" : "Complete your profile to enter SwipeConnect"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleTheme} className="icon-toggle lg:hidden">
                {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
              <NavLink to="/settings" className="icon-toggle lg:hidden">
                <Settings size={16} />
              </NavLink>
            </div>
          </header>

          <main key={location.pathname} className="page-stage">
            <Outlet />
          </main>
        </section>
      </div>

      <nav className="mobile-dock lg:hidden">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `dock-link ${isActive ? "active" : ""}`}>
            <item.icon size={17} />
            <span>{item.shortLabel}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppShell;
