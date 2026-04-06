import React from "react";
import clsx from "clsx";

export const Badge = ({
  variant = "primary",
  children,
  icon: Icon,
  className,
}) => {
  const variants = {
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    accent: "bg-accent-100 text-accent-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold gap-1.5",
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};
