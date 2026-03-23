import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard-grid glass-panel page-shell floating-in">
      <div className="dashboard-column">
        <div className="hero-block">
          <div className="kicker"><Icon name="spark" size={14} /> Your networking cockpit</div>
          <h1 className="page-title">Ready to build your next meaningful connection?</h1>
          <p className="muted">
            SkillSwipe is focused on professional momentum for Delhi/NCR techies, whether that means finding a mentor, guiding a mentee, or pairing up for a short project sprint.
          </p>
        </div>

        <div className="stat-grid">
          <article className="stat-card floating-in">
            <span className="stat-icon"><Icon name="bolt" size={18} /></span>
            <strong>{user?.swipesLeftToday ?? 0}</strong>
            <span>swipes left today</span>
          </article>
          <article className="stat-card floating-in">
            <span className="stat-icon"><Icon name="briefcase" size={18} /></span>
            <strong>{user?.roles?.length || 0}</strong>
            <span>active roles on your profile</span>
          </article>
          <article className="stat-card floating-in">
            <span className="stat-icon"><Icon name="spark" size={18} /></span>
            <strong>{user?.skills?.length || 0}</strong>
            <span>skills powering recommendations</span>
          </article>
        </div>

        <div className="profile-editor floating-in">
          <div className="section-heading">
            <div>
              <div className="kicker"><Icon name="cards" size={14} /> Matching logic</div>
              <h2 style={{ marginTop: 12 }}>How your feed gets smarter</h2>
              <p className="muted">Profiles with overlapping skills and aligned role interests surface first.</p>
            </div>
          </div>
          <div className="tag-cloud">
            {(user?.skills || []).map((skill) => <span key={skill} className="skill-tag active">{skill}</span>)}
          </div>
          <div className="cta-row">
            <Link className="primary-btn icon-btn" to="/swipe"><Icon name="cards" size={18} /> Start swiping</Link>
            <Link className="secondary-btn icon-btn" to="/matches"><Icon name="heart" size={18} /> View my matches</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-column">
        <div className="profile-sidebar floating-in">
          <div className="section-heading section-heading-tight">
            <div>
              <div className="kicker"><Icon name="user" size={14} /> Profile status</div>
              <h2 style={{ marginTop: 12 }}>Your card at a glance</h2>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 0 }}>
            {user?.isProfileComplete ? 'Your card is live in the swipe deck.' : 'Finish your profile to unlock swiping.'}
          </p>
          <div className="pill"><Icon name="location" size={14} /> {user?.location || 'Delhi/NCR'}</div>
          <p className="feature-copy">{user?.bio || 'Add a concise bio so people know how you like to collaborate.'}</p>
          <div className="role-picker">{(user?.roles || []).map((role) => <span key={role} className="role-chip active">{role}</span>)}</div>
          <Link to="/profile" className="ghost-btn icon-btn inline-action"><Icon name="user" size={18} /> Edit profile</Link>
        </div>

        <div className="profile-sidebar floating-in">
          <div className="kicker"><Icon name="bolt" size={14} /> Daily swipe discipline</div>
          <h3 style={{ marginTop: 12 }}>Keep every decision intentional</h3>
          <p className="muted">We simulate a premium networking rhythm with a 10-swipe daily cap so every decision feels considered.</p>
          <div className="inline-banner"><Icon name="spark" size={16} /> Use your limited swipes on people whose skills, roles, and availability line up with what you want next.</div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
