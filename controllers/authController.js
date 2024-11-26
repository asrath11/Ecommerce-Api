const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const dotenv = require('dotenv');
const sendEmail = require('./../utilities/email');
dotenv.config({ path: 'config.env' });

// Helper function to create JWT token
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true; // Send cookie over HTTPS in production
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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
    const token = createSendToken(user, 201, res);

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
    // Validation: Ensure both email and password are provided
    if (!email || !password) {
      return next(new Error('Please provide both email and password'));
    }
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new Error('User not found'));
    }
    // Compare passwords
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error('Incorrect password'));
    }
    // Create JWT token
    createSendToken(user, 201, res);
    // Send response with token and user data
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

exports.forgotPassword = async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new Error('There is no user with that email address'));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't request this, please ignore this email.`;
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Message sent to email',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.resetPassword = async function (req, res, next) {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new Error('Token is invalid or has expired'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined; // Remove token
    user.passwordResetExpires = undefined;
    await user.save();
    const token = createSendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
