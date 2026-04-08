import clsx from "clsx";

export const Badge = ({
  variant = "primary",
  children,
  icon: Icon,
  className,
}) => {
  const variants = {
    primary: "bg-[rgba(255,106,94,0.14)] text-[var(--primary-strong)]",
    secondary: "bg-[rgba(43,147,255,0.14)] text-[var(--secondary-strong)]",
    accent: "bg-[rgba(244,166,76,0.16)] text-[var(--accent-strong)]",
    success: "bg-[rgba(20,179,125,0.14)] text-[var(--success)]",
    warning: "bg-[rgba(217,119,6,0.14)] text-[var(--warning)]",
    error: "bg-[rgba(225,29,72,0.14)] text-[var(--danger)]",
    neutral: "bg-[var(--surface-subtle)] text-[var(--text-body)]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};
