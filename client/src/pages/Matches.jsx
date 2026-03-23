import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Loader from '../components/Loader';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';

function Matches() {
  const { api } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches');
        setMatches(response.data.matches || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load matches.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [api]);

  if (loading) return <Loader label="Loading your matches" variant="content" />;

  return (
    <section className="matches-layout glass-panel page-shell floating-in">
      <div className="matches-list floating-in">
        <div className="section-heading">
          <div>
            <div className="kicker"><Icon name="heart" size={14} /> Mutual interest</div>
            <h1 className="page-title">Your professional matches</h1>
          </div>
          <span className="pill"><Icon name="spark" size={14} /> {matches.length} active matches</span>
        </div>
        {error ? <div className="error-banner"><Icon name="x" size={16} /> {error}</div> : null}
        {matches.length ? (
          <div className="match-list-grid">
            {matches.map((match) => (
              <div key={match._id} className="match-entry">
                <ProfileCard user={match.partner} />
                <div className="inline-banner match-banner">
                  <Icon name="heart" size={16} /> You matched with {match.partner.name} on {new Date(match.matchedAt).toLocaleDateString()}.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state pop-in">
            <h3 style={{ marginTop: 0 }}>No matches yet</h3>
            <p className="muted">Once two professionals swipe right on each other, the match will appear here with a conversation starter.</p>
          </div>
        )}
      </div>
      <aside className="match-sidebar floating-in">
        <div className="kicker"><Icon name="spark" size={14} /> Conversation starters</div>
        <h2 style={{ marginTop: 12 }}>Chat placeholder</h2>
        <p className="muted">Messaging is intentionally lightweight for now. Each match keeps a simple starter note so you know when the connection was created.</p>
        {matches.slice(0, 3).map((match) => (
          <div key={match._id} className="profile-sidebar match-note-card">
            <strong>{match.partner.name}</strong>
            <p className="muted" style={{ marginBottom: 8 }}><Icon name="bolt" size={14} /> {new Date(match.matchedAt).toLocaleString()}</p>
            <p style={{ margin: 0 }}>{match.messages?.[0]?.content || 'Say hello and propose a quick intro call.'}</p>
          </div>
        ))}
      </aside>
    </section>
  );
}

export default Matches;
