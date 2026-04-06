export const formatDateTime = (value, options = {}) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(new Date(value));
};

export const formatRelativeTime = (value) => {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "";
  }

  const diffMs = timestamp - Date.now();
  const absMinutes = Math.round(Math.abs(diffMs) / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absMinutes < 60) {
    return formatter.format(Math.round(diffMs / 60000), "minute");
  }

  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) {
    return formatter.format(Math.round(diffMs / 3600000), "hour");
  }

  return formatter.format(Math.round(diffMs / 86400000), "day");
};

export const buildApiAssetUrl = (value, apiBaseUrl) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const origin = apiBaseUrl.replace(/\/api\/?$/, "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};
