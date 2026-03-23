import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

function Landing() {
  return (
    <main className="landing-layout">
      <section className="landing-shell glass-panel floating-in">
        <div className="landing-copy">
          <div className="kicker"><Icon name="spark" size={14} /> Professional only • mentors, mentees, collaborators</div>
          <h1 className="landing-title">Delhi/NCR tech talent, matched with intention.</h1>
          <p className="landing-copy-text">
            SkillSwipe helps developers, designers, and AI enthusiasts discover aligned mentors, mentees, and short-term project collaborators without the noise of a dating app.
          </p>

          <div className="cta-row">
            <Link to="/register" className="primary-btn icon-btn"><Icon name="user" size={18} /> Create your profile</Link>
            <Link to="/login" className="secondary-btn icon-btn"><Icon name="heart" size={18} /> I already have an account</Link>
          </div>

          <div className="hero-metrics landing-metrics">
            <div className="metric-card"><span className="stat-icon"><Icon name="bolt" size={18} /></span><strong>10</strong><span>curated swipes per day to keep quality high</span></div>
            <div className="metric-card"><span className="stat-icon"><Icon name="briefcase" size={18} /></span><strong>3 roles</strong><span>mentor, mentee, collaborator with multi-select support</span></div>
            <div className="metric-card"><span className="stat-icon"><Icon name="cards" size={18} /></span><strong>Native swipe</strong><span>touch-first interactions with smooth motion</span></div>
          </div>
        </div>

        <aside className="landing-preview">
          <div className="preview-card landing-preview-card">
            <div className="pill"><Icon name="spark" size={14} /> Featured stack</div>
            <h2 style={{ marginTop: 16 }}>React + Node builders across Delhi, Noida, Gurgaon, and beyond</h2>
            <p className="muted">Browse polished profile cards with skills, availability, location, and role intent so every swipe has context.</p>
            <div className="tag-cloud landing-tag-cloud">
              {['React', 'Node.js', 'AI/ML', 'UI/UX', 'Product Design', 'Next.js'].map((tag) => <span key={tag} className="skill-tag active">{tag}</span>)}
            </div>
            <div className="inline-banner"><Icon name="heart" size={16} /> Mutual interest becomes a professional match with a simple chat placeholder so conversations can begin fast.</div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Landing;
