import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/profile', label: 'Profile', icon: 'user' },
  { to: '/swipe', label: 'Swipe', icon: 'cards' },
  { to: '/matches', label: 'Matches', icon: 'heart' },
];

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleTabPress = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-shell">
        <header className="topbar glass-panel floating-in">
          <div className="brand-lockup">
            <div className="brand-mark">
              <Icon name="spark" size={18} />
            </div>
            <div>
              <div className="kicker">SkillSwipe • Delhi/NCR tech network</div>
              <h2 className="topbar-title">Build your next mentor match or project squad</h2>
              <p className="muted topbar-subtitle">Signed in as {user?.name}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="status-chip">
              <Icon name="bolt" size={16} />
              <span>{user?.swipesLeftToday ?? 0} swipes left</span>
            </div>
            <button type="button" className="ghost-btn icon-btn" onClick={handleLogout}>
              <Icon name="logout" size={18} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        <nav className="desktop-nav glass-panel floating-in">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link icon-nav ${isActive ? 'active' : ''}`}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <main key={location.pathname} className="page-transition route-stage">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-tabbar glass-panel">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={handleTabPress} className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
              <>
                <span className={`mobile-tab-indicator ${isActive ? 'active' : ''}`} />
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppShell;
