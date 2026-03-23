function ProfileCard({ user }) {
  const apiHost = import.meta.env.VITE_API_HOST || 'http://localhost:5000';
  const imageSrc = user.photo?.startsWith('http') ? user.photo : `${apiHost}${user.photo || ''}`;
  const fallbackSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88"><rect width="100%" height="100%" rx="18" fill="#1b2b45"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#d8e5ff" font-size="34" font-family="Arial">${user.name.charAt(0)}</text></svg>`
  )}`;

  return (
    <article className="match-card">
      <img src={user.photo ? imageSrc : fallbackSrc} alt={user.name} />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
          <div>
            <h3 style={{ margin: '0 0 6px' }}>{user.name}</h3>
            <p className="muted" style={{ margin: 0 }}>{user.location} • {user.availability}</p>
          </div>
          <span className="pill">{user.roles?.join(', ')}</span>
        </div>
        <p style={{ marginBottom: 10 }}>{user.bio}</p>
        <div className="tag-cloud">
          {user.skills?.map((skill) => <span className="skill-tag active" key={skill}>{skill}</span>)}
        </div>
      </div>
    </article>
  );
}

export default ProfileCard;
