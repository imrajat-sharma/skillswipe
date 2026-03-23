const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 240,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

matchSchema.index({ users: 1 }, { unique: false });

module.exports = mongoose.model('Match', matchSchema);
