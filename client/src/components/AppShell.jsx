import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Settings } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./Avatar";
import { BottomNav } from "./BottomNav";

const MotionMain = motion.main;

function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = user?.name?.split(" ")[0] || "Alex";
  const isProfileScreen = location.pathname === "/profile";

  return (
    <div className="app-mobile-shell">
      <section className="app-phone-frame">
        <header className={`mobile-header ${isProfileScreen ? "mobile-header--profile" : ""}`}>
          {isProfileScreen ? (
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => navigate(-1)} className="mobile-icon-button" aria-label="Go back">
                <ArrowLeft size={18} />
              </button>
              <div className="w-10" />
              <div className="w-10" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <NavLink to="/profile" className="mobile-header__identity">
                <Avatar name={user?.name} image={user?.photo} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[1.28rem] font-semibold leading-5 text-slate-700">Welcome back, {firstName}</p>
                  <span className="mobile-swipe-pill">{user?.swipesLeftToday ?? 12} Swipes Remaining</span>
                </div>
              </NavLink>

              <NavLink to="/settings" className="mobile-icon-button" aria-label="Open settings">
                <Settings size={18} />
              </NavLink>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          <MotionMain
            key={location.pathname}
            className="page-stage"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Outlet />
          </MotionMain>
        </AnimatePresence>
      </section>

      <BottomNav />
    </div>
  );
}

export default AppShell;
