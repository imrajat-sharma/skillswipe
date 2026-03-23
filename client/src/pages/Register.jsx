import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShowcase from '../components/AuthShowcase';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      navigate('/profile', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout auth-shell-layout">
      <section className="auth-shell">
        <AuthShowcase mode="register" />
        <section className="auth-card glass-panel floating-in">
          <div className="kicker"><Icon name="user" size={14} /> Start networking better</div>
          <h1 className="page-title auth-title">Create your SkillSwipe account</h1>
          <p className="muted">You’ll complete your profile next so your matches are relevant from the first swipe.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} minLength="6" required />
            </div>
            {error ? <div className="error-banner"><Icon name="x" size={16} /> {error}</div> : null}
            <button type="submit" className="primary-btn icon-btn" disabled={submitting}><Icon name="spark" size={18} /> {submitting ? 'Creating account...' : 'Register'}</button>
          </form>
          <p className="muted auth-footer-copy">Already on SkillSwipe? <Link to="/login" className="auth-link">Login here</Link></p>
        </section>
      </section>
    </main>
  );
}

export default Register;
