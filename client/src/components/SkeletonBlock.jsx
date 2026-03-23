function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton-block ${className}`.trim()} aria-hidden="true" />;
}

export default SkeletonBlock;
