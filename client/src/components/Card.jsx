import React from "react";
import clsx from "clsx";

export const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-soft",
        hover &&
          "hover:shadow-soft-lg hover:border-gray-300 transition-all duration-300 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
