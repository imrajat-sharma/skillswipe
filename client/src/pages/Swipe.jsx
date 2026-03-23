import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import MatchModal from '../components/MatchModal';
import SwipeCard from '../components/SwipeCard';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/CardStack.module.css';

function Swipe() {
  const navigate = useNavigate();
  const { api, setUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swipesLeft, setSwipesLeft] = useState(0);
  const [error, setError] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [matchModal, setMatchModal] = useState(null);
  const [needsRefill, setNeedsRefill] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/swipe/next');
      setProfiles(response.data.profiles || []);
      setSwipesLeft(response.data.swipesLeft || 0);
      setMatchMessage('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load profiles right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleSwipe = async (targetId, direction) => {
    try {
      const response = await api.post('/swipe/action', { targetId, direction });
      setProfiles((prev) => prev.filter((profile) => profile._id !== targetId));
      setSwipesLeft(response.data.swipesLeft);
      setUser((prev) => prev ? { ...prev, swipesLeftToday: response.data.swipesLeft, swipesToday: (prev.swipesToday || 0) + 1 } : prev);
      if (response.data.isMatch) {
        setMatchMessage('Mutual interest. You have a new professional match waiting in the Matches tab.');
        setMatchModal(response.data.match);
      }
      setNeedsRefill(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Swipe could not be saved.');
    }
  };

  useEffect(() => {
    if (!loading && needsRefill && profiles.length <= 2 && swipesLeft > 0) {
      setNeedsRefill(false);
      fetchProfiles();
    }
  }, [profiles.length, swipesLeft, loading, needsRefill]);

  return (
    <section className={`swipe-layout glass-panel page-shell floating-in ${styles.swipePage}`}>
      <div className="section-heading section-heading-tight">
        <div>
          <div className="kicker"><Icon name="cards" size={14} /> Swipe deck</div>
          <h1 className="page-title">Discover Delhi/NCR builders who fit your lane</h1>
          <p className="muted">Drag right to express interest, drag left to pass, and keep an eye on your daily swipe budget.</p>
        </div>
        <div className="swipe-chip"><Icon name="bolt" size={16} /> Swipes left today: <strong>{swipesLeft}</strong></div>
      </div>

      <div className="swipe-legend">
        <span className="legend-pill legend-skip"><Icon name="x" size={14} /> Skip</span>
        <span className="legend-pill legend-like"><Icon name="heart" size={14} /> Interested</span>
      </div>

      {matchMessage ? <div className="success-banner slide-up"><Icon name="spark" size={16} /> {matchMessage}</div> : null}
      {error ? <div className="error-banner slide-up"><Icon name="x" size={16} /> {error}</div> : null}
      {loading ? (
        <Loader label="Loading your curated deck" variant="cards" />
      ) : profiles.length ? (
        <>
          <div className={styles.stackWrap}>
            {profiles.slice(0, 5).map((profile, index) => (
              <SwipeCard key={profile._id} profile={profile} onSwipe={handleSwipe} isTop={index === 0} stackIndex={index} />
            ))}
          </div>
          <div className="swipe-actions swipe-actions-sticky">
            <button type="button" className="secondary-btn icon-btn swipe-action-btn" onClick={() => handleSwipe(profiles[0]._id, 'pass')}><Icon name="x" size={18} /> Skip</button>
            <button type="button" className="primary-btn icon-btn swipe-action-btn" onClick={() => handleSwipe(profiles[0]._id, 'like')}><Icon name="heart" size={18} /> Interested</button>
          </div>
        </>
      ) : (
        <div className="empty-state pop-in">
          <h3 style={{ marginTop: 0 }}>No more profiles right now</h3>
          <p className="muted">You’ve either exhausted today’s swipe limit or cleared the current deck. Refresh to check again.</p>
          <button type="button" className="primary-btn icon-btn" onClick={fetchProfiles}><Icon name="spark" size={18} /> Refresh deck</button>
        </div>
      )}
      <MatchModal open={Boolean(matchModal)} match={matchModal} onClose={() => setMatchModal(null)} onViewMatches={() => navigate('/matches')} />
    </section>
  );
}

export default Swipe;
