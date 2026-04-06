const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
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
  createdAt: user.createdAt,
});

module.exports = {
  formatUser,
};
