import { motion as Motion } from "framer-motion";
import { ArrowRight, Compass, MessageSquareText, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    icon: Sparkles,
    title: "Context-first feed",
    copy: "Share text updates, image drops, and quick polls before anyone swipes on your profile.",
  },
  {
    icon: Compass,
    title: "Discovery with intent",
    copy: "Use the existing swipe engine from the backend to find mentors, students, and collaborators.",
  },
  {
    icon: MessageSquareText,
    title: "Fast activity loop",
    copy: "Move from a mutual match into real conversation without leaving the app shell.",
  },
];

function Landing() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to={user.isProfileComplete ? "/feed" : "/onboarding"} replace />;
  }

  return (
    <main className="auth-scene px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <Motion.section
          className="hero-panel rounded-[2rem] p-6 md:p-8 lg:p-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="section-label">SkillSwipe mobile web</div>
          <h1 className="hero-title mt-4">Build your network like a native app, not a cold directory.</h1>
          <p className="hero-copy mt-5 max-w-2xl">
            SkillSwipe turns your existing backend into a fast, tactile social network for builders: post what you are
            making, discover aligned people, and move into activity and chat with Material-style flow.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/onboarding">
              <Button variant="primary" size="lg">
                Get Started
                <ArrowRight size={17} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="hero-ribbon mt-8">
            <span>Feed + discover + activity</span>
            <span>Session auth</span>
            <span>Mobile-first navigation</span>
            <span>Native-feeling motion</span>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="feature-glass">
                <item.icon size={18} />
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </Motion.section>

        <Motion.aside
          className="hero-panel rounded-[2rem] p-6 md:p-8 lg:p-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06 }}
        >
          <div className="section-label">Flow preview</div>
          <h2 className="h2 mt-4">Landing to onboarding to dashboard in one clean path</h2>
          <div className="mt-6 grid gap-3">
            {[
              ["1", "Get Started", "Enter through a focused landing screen with a single primary CTA."],
              ["2", "Signup + setup", "Create an account, then complete the multi-step profile flow against `/api/profile`."],
              ["3", "Daily loop", "Feed, Discover, Activity, and Profile stay pinned in the bottom nav after auth."],
            ].map(([step, title, copy]) => (
              <div key={step} className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-4">
                <div className="flex items-start gap-3">
                  <div className="brand-mark h-10 w-10 text-sm">{step}</div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-strong)]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Motion.aside>
      </div>
    </main>
  );
}

export default Landing;
