const mongoose = require('mongoose');

const userAuthorSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true, // Ensures email consistency
    },
    profileImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { strict: true } // Enforces strict schema mode
);

const UserAuthor = mongoose.model('UserAuthor', userAuthorSchema);

module.exports = UserAuthor;
