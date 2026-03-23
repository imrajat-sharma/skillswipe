import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShowcase from '../components/AuthShowcase';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleAuthUrl } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await login(form);
      const redirect = location.state?.from?.pathname || (user.isProfileComplete ? '/dashboard' : '/profile');
      navigate(redirect, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout auth-shell-layout">
      <section className="auth-shell">
        <AuthShowcase mode="login" />
        <section className="auth-card glass-panel floating-in">
          <div className="kicker"><Icon name="heart" size={14} /> Welcome back</div>
          <h1 className="page-title auth-title">Sign in to your SkillSwipe account</h1>
          <p className="muted">Pick up where you left off with mentors, mentees, and collaborators around Delhi/NCR.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required />
            </div>
            {error ? <div className="error-banner"><Icon name="x" size={16} /> {error}</div> : null}
            <button type="submit" className="primary-btn icon-btn" disabled={submitting}><Icon name="check" size={18} /> {submitting ? 'Signing in...' : 'Login'}</button>
          </form>
          <button type="button" className="secondary-btn icon-btn auth-google-btn" onClick={() => window.location.assign(googleAuthUrl)}>
            <Icon name="spark" size={18} /> Continue with Google
          </button>
          <p className="muted auth-footer-copy">Need an account? <Link to="/register" className="auth-link">Register here</Link></p>
        </section>
      </section>
    </main>
  );
}

export default Login;
