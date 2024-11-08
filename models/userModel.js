const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'], // Ensure name is required
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide an email address'],
    lowercase: true, // Store email in lowercase
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'], // Password length validation
    select: false, // This will ensure password is not included in the query result by default
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password; // Check if password and confirm password match
      },
      message: 'Passwords do not match',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  this.password = await bcrypt.hash(this.password, 12); // Hash password
  this.passwordConfirm = undefined; // Remove passwordConfirm from saved user
  next(); // Call next to proceed with saving
});

// Method to compare passwords (used in login)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
