import React from "react";
import clsx from "clsx";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white hover:shadow-soft-lg active:scale-[0.98] focus:ring-primary-500",
      secondary:
        "bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:scale-[0.98] focus:ring-secondary-500",
      accent:
        "bg-accent-100 text-accent-700 hover:bg-accent-200 active:scale-[0.98] focus:ring-accent-500",
      outline:
        "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] focus:ring-slate-500",
      ghost:
        "text-slate-600 hover:bg-slate-100 active:scale-[0.98] focus:ring-slate-500",
      success:
        "bg-secondary-600 text-white hover:bg-secondary-700 active:scale-[0.98] focus:ring-secondary-500",
    };

    const sizeClasses = {
      sm: "px-3.5 py-2 text-[12px] gap-1.5",
      md: "px-5 py-2.5 text-[13px] gap-2",
      lg: "px-6 py-3 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
