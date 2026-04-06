import { createElement } from "react";
import { Bell, Compass, Home, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Feed", icon: Home, href: "/home" },
  { label: "Discover", icon: Compass, href: "/discover" },
  { label: "Matches", icon: Users, href: "/matches" },
  { label: "Alerts", icon: Bell, href: "/notifications" },
  { label: "Profile", icon: User, href: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-[min(95vw,33rem)] -translate-x-1/2 rounded-[1.65rem] border border-slate-200/80 bg-white/90 p-1.5 shadow-soft backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex min-h-[56px] flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition ${
                isActive ? "bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-soft" : "text-slate-500"
              }`}
            >
              {createElement(Icon, { size: 17 })}
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
