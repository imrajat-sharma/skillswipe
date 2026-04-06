// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return formatDate(date);
};

// Calculate match percentage based on common skills
export const calculateMatchPercentage = (user1Skills, user2Skills) => {
  if (!user1Skills?.length || !user2Skills?.length) return 0;
  const common = user1Skills.filter((s) => user2Skills.includes(s)).length;
  return Math.round(
    (common / Math.max(user1Skills.length, user2Skills.length)) * 100,
  );
};

// Truncate text to specified length
export const truncateText = (text, length = 50) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Debounce function for search/filter
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Classify notification type by label
export const getNotificationIcon = (type) => {
  const icons = {
    match: "💗",
    message: "💬",
    opportunity: "💼",
    connection: "👤",
    achievement: "🎉",
    default: "📌",
  };
  return icons[type] || icons.default;
};

// Validate email format
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
