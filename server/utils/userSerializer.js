const normalizeRole = (role) => {
  const value = String(role || '').trim();
  if (!value) return '';
  return value.toLowerCase() === 'mentee' ? 'Student' : value;
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  roles: (user.roles || []).map(normalizeRole).filter(Boolean),
  bio: user.bio,
  skills: user.skills,
  location: user.location,
  pincode: user.pincode,
  availability: user.availability,
  photo: user.photo,
  isProfileComplete: user.isProfileComplete,
  swipesToday: user.swipesToday,
  dailySwipeLimit: user.dailySwipeLimit,
  swipesLeftToday: Math.max(user.dailySwipeLimit - user.swipesToday, 0),
  lastSwipeDate: user.lastSwipeDate,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = {
  formatUser,
};
