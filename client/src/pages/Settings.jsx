import { AlertTriangle, LogOut, MoonStar, ShieldCheck, SlidersHorizontal, Sun, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <section className="page-container">
      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="section-label">Settings</div>
        <h1 className="h2 mt-3">Account and experience controls</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
          This page stays practical: account overview, profile hygiene, appearance controls, and the current backend
          capability boundary.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: UserCog,
              title: "Profile hygiene",
              copy: `${user?.isProfileComplete ? "Your profile is complete." : "Your profile still needs work."}`,
            },
            {
              icon: ShieldCheck,
              title: "Session mode",
              copy: "Authentication uses secure backend sessions instead of client-side tokens.",
            },
            {
              icon: SlidersHorizontal,
              title: "Product status",
              copy: "Frontend now uses the live auth, discover, matches, profile, and posts APIs.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-soft">
              <item.icon size={20} className="text-rose-500" />
              <h2 className="mt-4 font-display text-xl font-bold text-[var(--text-strong)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="section-label">Appearance</div>
                <h2 className="mt-2 text-xl font-bold text-[var(--text-strong)]">Theme mode</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  Switch between light and dark modes from anywhere in the app.
                </p>
              </div>
              {isDark ? <MoonStar size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
            </div>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={toggleTheme}>
                {isDark ? "Switch to light mode" : "Switch to dark mode"}
              </Button>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-rose-200/70 bg-rose-50/70 p-5 shadow-soft dark:border-rose-500/20 dark:bg-rose-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="mt-1 text-rose-500" />
              <div>
                <div className="section-label">Account management</div>
                <h2 className="mt-2 text-xl font-bold text-[var(--text-strong)]">Deactivate and delete account</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  The UI is ready for destructive account actions, but the current backend does not expose deactivate or
                  delete endpoints yet, so these controls remain informational for now.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button type="button" variant="outline" disabled>
                    Deactivate account
                  </Button>
                  <Button type="button" variant="ghost" disabled>
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button type="button" variant="primary" onClick={() => navigate("/profile")}>
            Manage profile
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/feed")}>
            Back to feed
          </Button>
          <Button type="button" variant="ghost" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </div>
    </section>
  );
}
