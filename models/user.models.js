const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    max: 11,
    min: 11,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;

