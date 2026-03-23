import Icon from './Icon';

function AuthShowcase({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const title = isLogin ? 'Your next mentor or collaborator is one swipe away.' : 'Professional chemistry, minus the awkward networking cold start.';
  const body = isLogin
    ? 'Step back into a curated feed of Delhi/NCR builders, designers, and AI enthusiasts whose intent is clear from the first glance.'
    : 'Create a profile that makes your skills, availability, and goals obvious so the right mentors, mentees, and project partners can find you quickly.';

  const stats = isLogin
    ? [
        { icon: 'heart', value: 'Mutual matches', label: 'interest-based professional matching' },
        { icon: 'cards', value: 'Native swipe', label: 'smooth touch-first interactions' },
        { icon: 'bolt', value: 'Daily focus', label: '10 high-intent swipes per day' },
      ]
    : [
        { icon: 'briefcase', value: '3 roles', label: 'mentor, mentee, collaborator' },
        { icon: 'spark', value: 'Skill tags', label: 'surface the right overlap faster' },
        { icon: 'location', value: 'Delhi/NCR', label: 'local-first tech network' },
      ];

  return (
    <aside className="auth-showcase glass-panel floating-in">
      <div className="auth-showcase-glow" />
      <div className="kicker"><Icon name="spark" size={14} /> SkillSwipe preview</div>
      <h2 className="auth-showcase-title">{title}</h2>
      <p className="muted auth-showcase-copy">{body}</p>

      <div className="auth-showcase-stack">
        <div className="auth-mini-card auth-mini-primary">
          <div className="auth-mini-head">
            <span className="pill"><Icon name="briefcase" size={14} /> Mentor • Collaborator</span>
            <span className="auth-mini-badge"><Icon name="location" size={14} /> Gurgaon</span>
          </div>
          <h3>Senior React Engineer</h3>
          <p>Helping early-stage builders ship polished frontend systems and pairing on AI-powered product prototypes.</p>
          <div className="tag-cloud">
            {['React', 'TypeScript', 'Node.js'].map((item) => <span key={item} className="skill-tag active">{item}</span>)}
          </div>
        </div>
        <div className="auth-mini-card auth-mini-secondary">
          <div className="auth-mini-pill"><Icon name="heart" size={14} /> Match energy</div>
          <p>Profiles with overlapping skills and aligned intent rise naturally to the top of the deck.</p>
        </div>
      </div>

      <div className="auth-showcase-stats">
        {stats.map((stat) => (
          <div key={stat.value} className="auth-showcase-stat">
            <span className="stat-icon"><Icon name={stat.icon} size={16} /></span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default AuthShowcase;
