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
    const baseClasses = "app-button";

    const variantClasses = {
      primary: "app-button--primary",
      secondary: "app-button--secondary",
      accent: "app-button--accent",
      outline: "app-button--outline",
      ghost: "app-button--ghost",
      success: "app-button--success",
    };

    const sizeClasses = {
      sm: "app-button--sm",
      md: "app-button--md",
      lg: "app-button--lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="app-button__spinner" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
