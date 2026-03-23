function Icon({ name, size = 20, stroke = 1.8, className = '' }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  const icons = {
    home: (
      <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />
    ),
    user: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    cards: (
      <>
        <rect x="6" y="4" width="12" height="16" rx="3" />
        <path d="M9 2h6" />
      </>
    ),
    heart: (
      <path d="M12 20.5s-7-4.35-7-10.02A4.48 4.48 0 0 1 9.54 6c1.06 0 2.08.4 2.82 1.12A3.94 3.94 0 0 1 15.18 6 4.48 4.48 0 0 1 20 10.48c0 5.67-8 10.02-8 10.02Z" />
    ),
    spark: (
      <>
        <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z" />
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    x: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    check: (
      <path d="m5 12 4 4L19 6" />
    ),
    bolt: (
      <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" />
    ),
  };

  return <svg {...commonProps}>{icons[name] || icons.spark}</svg>;
}

export default Icon;
