const mongoose = require('mongoose');

const ALLOWED_ROLES = ['Mentor', 'Mentee', 'Collaborator'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    roles: {
      type: [String],
      enum: ALLOWED_ROLES,
      default: [],
    },
    bio: {
      type: String,
      maxlength: 200,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: 'Delhi/NCR',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    availability: {
      type: String,
      default: '',
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    swipedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    dailySwipeLimit: {
      type: Number,
      default: 10,
    },
    swipesToday: {
      type: Number,
      default: 0,
    },
    lastSwipeDate: {
      type: Date,
      default: Date.now,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ skills: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ location: 1 });

module.exports = mongoose.model('User', userSchema);
