import Icon from './Icon';

function MatchModal({ open, match, onClose, onViewMatches }) {
  if (!open || !match?.partner) {
    return null;
  }

  const apiHost = import.meta.env.VITE_API_HOST || 'http://localhost:5000';
  const imageSrc = match.partner.photo?.startsWith('http') ? match.partner.photo : `${apiHost}${match.partner.photo || ''}`;
  const fallbackSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><rect width="100%" height="100%" rx="32" fill="#1b2b45"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#d8e5ff" font-size="92" font-family="Arial">${match.partner.name.charAt(0)}</text></svg>`
  )}`;

  return (
    <div className="match-modal-backdrop" role="dialog" aria-modal="true">
      <div className="match-modal glass-panel pop-in">
        <button type="button" className="match-modal-close" onClick={onClose} aria-label="Close match modal">
          <Icon name="x" size={18} />
        </button>
        <div className="kicker"><Icon name="spark" size={14} /> New match</div>
        <h2 className="match-modal-title">It is a match with {match.partner.name}</h2>
        <p className="muted match-modal-copy">
          You both expressed professional interest. This is a strong moment to suggest a quick intro call, mentorship chat, or scoped project sprint.
        </p>

        <div className="match-modal-profile">
          <img src={match.partner.photo ? imageSrc : fallbackSrc} alt={match.partner.name} />
          <div>
            <span className="pill"><Icon name="briefcase" size={14} /> {match.partner.roles?.join(', ')}</span>
            <p className="match-modal-bio">{match.partner.bio}</p>
            <div className="tag-cloud">
              {match.partner.skills?.slice(0, 4).map((skill) => <span key={skill} className="skill-tag active">{skill}</span>)}
            </div>
          </div>
        </div>

        <div className="match-modal-actions">
          <button type="button" className="secondary-btn icon-btn" onClick={onClose}><Icon name="cards" size={18} /> Keep swiping</button>
          <button type="button" className="primary-btn icon-btn" onClick={onViewMatches}><Icon name="heart" size={18} /> View matches</button>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;
