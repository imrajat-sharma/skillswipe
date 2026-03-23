import SkeletonBlock from './SkeletonBlock';

function Loader({ label = 'Loading', fullScreen = false, variant = 'content' }) {
  const containerClass = `loader-wrap ${fullScreen ? 'full-screen' : ''}`;

  return (
    <div className={containerClass}>
      <div className="skeleton-shell" aria-hidden="true">
        {variant === 'cards' ? (
          <div className="skeleton-cards">
            <SkeletonBlock className="skeleton-title" />
            <SkeletonBlock className="skeleton-pill" />
            <SkeletonBlock className="skeleton-card-lg" />
            <div className="skeleton-action-row">
              <SkeletonBlock className="skeleton-btn" />
              <SkeletonBlock className="skeleton-btn" />
            </div>
          </div>
        ) : variant === 'auth' ? (
          <div className="skeleton-auth">
            <SkeletonBlock className="skeleton-title" />
            <SkeletonBlock className="skeleton-line" />
            <SkeletonBlock className="skeleton-input" />
            <SkeletonBlock className="skeleton-input" />
            <SkeletonBlock className="skeleton-btn-wide" />
          </div>
        ) : (
          <div className="skeleton-content">
            <SkeletonBlock className="skeleton-title" />
            <SkeletonBlock className="skeleton-line" />
            <SkeletonBlock className="skeleton-card" />
            <SkeletonBlock className="skeleton-card" />
          </div>
        )}
      </div>
      <div className="muted loader-caption">{label}</div>
    </div>
  );
}

export default Loader;
