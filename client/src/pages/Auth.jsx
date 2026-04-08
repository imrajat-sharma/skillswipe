import { Eye, EyeOff, Lock, Mail, MoonStar, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, authError, setAuthError, googleAuthUrl, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      navigate(user.isProfileComplete ? "/feed" : "/onboarding", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setAuthError("");
    setLocalError("");
  }, [initialMode, setAuthError]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      if (isLogin) {
        const nextUser = await login({ email: formData.email, password: formData.password });
        navigate(nextUser?.isProfileComplete ? location.state?.from?.pathname || "/feed" : "/onboarding", {
          replace: true,
        });
      } else {
        const nextUser = await register({ name: formData.name, email: formData.email, password: formData.password });
        navigate(nextUser?.isProfileComplete ? "/feed" : "/onboarding", { replace: true });
      }
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-scene px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center gap-4 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="hero-panel relative rounded-[2rem] p-5 md:p-8">
          <div className="absolute right-5 top-5">
            <button type="button" onClick={toggleTheme} className="icon-toggle">
              {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
            </button>
          </div>

          <div className="section-label">SkillSwipe network</div>
          <h1 className="h2 mt-4">Professional matching that feels social, fast, and human.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Meet mentors, mentees, and collaborators across your ecosystem. Share progress with posts, build context
            before you swipe, and keep momentum after the match.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Posts", "Share image updates, text insights, and polls."],
              ["Discover", "Swipe through people with overlapping skills and goals."],
              ["Matches", "Keep track of mutual connections and conversations."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[1.2rem] bg-[linear-gradient(135deg,#101828,#1f3a5f)] px-4 py-4 text-white shadow-soft">
                <h2 className="font-display text-base font-semibold">{title}</h2>
                <p className="mt-2 text-xs leading-6 text-white/75">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <div className="section-label">{isLogin ? "Welcome back" : "Create account"}</div>
          <h2 className="h2 mt-2.5">{isLogin ? "Sign in to continue" : "Start your SkillSwipe profile"}</h2>
          <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
            {isLogin ? "Jump back into your feed and discover queue." : "Create your account and complete your profile to start swiping."}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            {!isLogin ? (
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-[var(--text-body)]">Full name</span>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input className="input pl-12" name="name" value={formData.name} onChange={handleInputChange} placeholder="Rajat Kumar" />
                </div>
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-body)]">Email address</span>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="input pl-12" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-[var(--text-body)]">Password</span>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  className="input pl-12 pr-12"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {!isLogin ? (
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-[var(--text-body)]">Confirm password</span>
                <input
                  className="input"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Repeat your password"
                />
              </label>
            ) : null}

            {localError || authError ? <div className="status-message error">{localError || authError}</div> : null}

            <Button type="submit" variant="primary" size="lg" className="w-full justify-center" isLoading={isLoading}>
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          <a
            href={googleAuthUrl}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-body)] shadow-soft"
          >
            Continue with Google
          </a>

          <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
            {isLogin ? "Need an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/register" : "/login"}
              onClick={() => {
                setIsLogin((current) => !current);
                setAuthError("");
                setLocalError("");
              }}
              className="font-semibold text-rose-500"
            >
              {isLogin ? "Register" : "Sign in"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
