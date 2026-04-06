import { LogOut, ShieldCheck, SlidersHorizontal, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <section className="page-container pt-8">
      <div className="page-surface rounded-[2.25rem] p-6 md:p-8">
        <div className="section-label">Settings</div>
        <h1 className="h2 mt-3 text-slate-900">Account and experience controls</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This page is intentionally practical for now: account overview, profile hygiene, and a clean sign-out flow.
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
            <article key={item.title} className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-soft">
              <item.icon size={20} className="text-primary-700" />
              <h2 className="mt-4 font-display text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button type="button" variant="primary" onClick={() => navigate("/profile")}>
            Manage profile
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/home")}>
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
