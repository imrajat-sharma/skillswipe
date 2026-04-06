import { Bell, Compass, LogOut, Settings } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./Avatar";

export const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/86 backdrop-blur-xl">
      <div className="page-container relative z-10 flex items-center justify-between gap-3 py-3">
        <Link to="/home" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 font-display text-sm font-bold text-white shadow-soft">
            SS
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-[15px] font-semibold text-slate-900">SkillSwipe</p>
            <p className="text-xs text-slate-500">Mentors and builders network</p>
          </div>
        </Link>

        <nav className="hide-scrollbar hidden items-center gap-1.5 overflow-x-auto rounded-full border border-slate-200 bg-white/80 p-1 lg:flex">
          {[
            { to: "/home", label: "Feed" },
            { to: "/discover", label: "Discover" },
            { to: "/matches", label: "Matches" },
            { to: "/profile", label: "Profile" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `shell-nav-link rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${isActive ? "active" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/discover"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-soft md:inline-flex"
          >
            <Compass size={15} />
            {user?.swipesLeftToday ?? 0} swipes left
          </Link>
          <Link to="/notifications" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-soft">
            <Bell size={16} />
          </Link>
          <Link to="/settings" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-soft">
            <Settings size={16} />
          </Link>
          <Link to="/profile" className="hidden sm:inline-flex">
            <Avatar name={user?.name} image={user?.photo} size="sm" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-soft transition hover:bg-slate-50"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
