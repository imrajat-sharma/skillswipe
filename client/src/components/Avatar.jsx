import React from "react";
import { buildApiAssetUrl } from "../utils/formatters";

export const Avatar = ({ name, image, size = "md", status = null }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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

  const avatarSource = buildApiAssetUrl(image, apiBaseUrl);

  return (
    <div className="relative inline-block">
      {avatarSource ? (
        <img
          src={avatarSource}
          alt={name}
          className={`${sizeClasses[size]} rounded-full border-2 border-white object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold`}
        >
          {initials}
        </div>
      )}
      {status ? (
        <span
          className={`absolute bottom-0 right-0 ${size === "xs" ? "h-2 w-2" : size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} rounded-full ${status === "online" ? "bg-green-500" : "bg-gray-400"} border-2 border-white`}
        />
      ) : null}
    </div>
  );
};
