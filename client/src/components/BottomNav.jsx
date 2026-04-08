import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { shellNavItems } from "./navigation";

const MotionSpan = motion.span;

export const BottomNav = () => {
  return (
    <nav
      className="mobile-dock"
      aria-label="Primary navigation"
      style={{ gridTemplateColumns: `repeat(${shellNavItems.length}, minmax(0, 1fr))` }}
    >
      {shellNavItems.map(({ label, icon, href }) => {
        const NavIcon = icon;

        return (
          <NavLink key={href} to={href} className={({ isActive }) => `dock-link ${isActive ? "active" : ""}`}>
            {({ isActive }) => (
              <MotionSpan
                className="dock-link-inner"
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                <span className={`dock-icon ${isActive ? "active" : ""}`}>
                  <NavIcon size={18} strokeWidth={isActive ? 2.3 : 2} />
                </span>
                <span>{label}</span>
              </MotionSpan>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
