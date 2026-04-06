const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    votesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true }
);

const postCommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'poll'],
      required: true,
    },
    formatting: {
      type: String,
      enum: ['plain', 'markdown'],
      default: 'plain',
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    poll: {
      question: {
        type: String,
        trim: true,
        maxlength: 240,
        default: '',
      },
      options: {
        type: [pollOptionSchema],
        default: [],
        validate: {
          validator(value) {
            return !value.length || (value.length >= 2 && value.length <= 4);
          },
          message: 'Polls must include between 2 and 4 options.',
        },
      },
      closesAt: {
        type: Date,
        default: null,
      },
    },
    likedBy: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      default: [],
    },
    sharedBy: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      default: [],
    },
    comments: {
      type: [postCommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
