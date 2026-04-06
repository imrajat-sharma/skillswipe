import React from "react";

export const Avatar = ({
  name,
  image,
  size = "md",
  status = null,
}) => {
  const sizeClasses = {
    xs: "w-8 h-8 text-xs",
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="relative inline-block">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center border-2 border-white`}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${size === "xs" ? "w-2 h-2" : size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} rounded-full ${status === "online" ? "bg-green-500" : "bg-gray-400"} border-2 border-white`}
        />
      )}
    </div>
  );
};
