const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

// Helper function to create JWT token
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

// Signup handler
exports.signup = async function (req, res, next) {
  try {
    const { email, password, passwordConfirm, name, role } = req.body;

    // Validation: Ensure email and password are provided
    if (!email || !password || !passwordConfirm) {
      return next(new Error('Please provide both email and password'));
    }

    // Create the user
    const user = await User.create({
      email,
      password,
      passwordConfirm,
      name,
      role,
    });

    // Create token
    const token = createToken(user._id);

    // Respond with token and user data
    res.status(201).json({
      status: 'success',
      token,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login handler
exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Validation: Ensure both email and password are provided
    if (!email || !password) {
      return next(new Error('Please provide both email and password'));
    }
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user) {
      return next(new Error('User not found'));
    }
    // Compare passwords
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error('Incorrect password'));
    }
    // Create JWT token
    console.log(user._id);
    const token = createToken(user._id);
    // Send response with token and user data
    res.status(200).json({
      status: 'success',
      token,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

// Protect middleware to verify JWT token
exports.protect = async function (req, res, next) {
  try {
    // Check if token exists
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(
        new Error('You are not logged in! Please log in to get access.')
      );
    }

    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new Error('The user belonging to this token no longer exists.')
      );
    }

    // Grant access to the protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new Error('Invalid token! Please log in again.'));
  }
};

// restrictTo middleware to allow access based on roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
