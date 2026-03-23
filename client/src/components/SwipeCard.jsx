import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import styles from '../styles/SwipeCard.module.css';

const THRESHOLD = 150;

function SwipeCard({ profile, onSwipe, isTop, stackIndex }) {
  const cardRef = useRef(null);
  const pointerState = useRef({ pointerId: null, startX: 0, startY: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setDragging(false);
    setAnimatingOut(false);
  }, [profile._id]);

  const apiHost = import.meta.env.VITE_API_HOST || 'http://localhost:5000';
  const imageSrc = profile.photo?.startsWith('http') ? profile.photo : `${apiHost}${profile.photo || ''}`;
  const rotation = Math.max(-35, Math.min(35, offset.x / 10));
  const likeOpacity = Math.max(0, Math.min(1, offset.x / THRESHOLD));
  const skipOpacity = Math.max(0, Math.min(1, -offset.x / THRESHOLD));

  const dragStyle = useMemo(() => ({
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotation}deg) scale(${isTop ? 1 : 1 - stackIndex * 0.02})`,
    zIndex: 100 - stackIndex,
    transition: dragging ? 'none' : animatingOut ? 'transform 240ms ease-out, opacity 240ms ease-out' : 'transform 260ms cubic-bezier(0.2, 0.9, 0.22, 1.08)',
  }), [offset.x, offset.y, rotation, dragging, animatingOut, isTop, stackIndex]);

  const releaseCard = (direction) => {
    setAnimatingOut(true);
    const flyX = direction === 'like' ? window.innerWidth : -window.innerWidth;
    setOffset((current) => ({ x: flyX, y: current.y + 30 }));
    window.setTimeout(() => onSwipe(profile._id, direction), 180);
  };

  const handlePointerDown = (event) => {
    if (!isTop) return;
    pointerState.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    cardRef.current?.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragging || event.pointerId !== pointerState.current.pointerId) return;
    const nextX = event.clientX - pointerState.current.startX;
    const nextY = (event.clientY - pointerState.current.startY) * 0.35;
    setOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event) => {
    if (!dragging || event.pointerId !== pointerState.current.pointerId) return;
    setDragging(false);
    const direction = offset.x > THRESHOLD ? 'like' : offset.x < -THRESHOLD ? 'pass' : null;
    if (direction) releaseCard(direction);
    else setOffset({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${isTop ? styles.topCard : styles.stackedCard}`}
      style={dragStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className={styles.overlayLike} style={{ opacity: likeOpacity }}><Icon name="heart" size={18} /> LIKE</div>
      <div className={styles.overlaySkip} style={{ opacity: skipOpacity }}><Icon name="x" size={18} /> SKIP</div>
      <div className={styles.mediaWrap}>
        {profile.photo ? <img src={imageSrc} alt={profile.name} className={styles.media} /> : <div className={styles.mediaPlaceholder}>{profile.name.charAt(0)}</div>}
        <div className={styles.mediaScrim} />
      </div>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <div>
            <h2>{profile.name}</h2>
            <p className={styles.metaLine}><Icon name="location" size={14} /> {profile.location}</p>
          </div>
          <span className={styles.roleBadge}><Icon name="briefcase" size={14} /> {profile.roles?.join(', ')}</span>
        </div>
        <p className={styles.bio}>{profile.bio}</p>
        <div className={styles.tagRow}>
          {profile.skills?.slice(0, 3).map((skill) => <span key={skill} className={styles.tag}>{skill}</span>)}
        </div>
        <div className={styles.footerMeta}>
          <span><Icon name="bolt" size={14} /> {profile.availability}</span>
          <span><Icon name="spark" size={14} /> {profile.skills?.length || 0} skills</span>
        </div>
      </div>
    </article>
  );
}

export default SwipeCard;
