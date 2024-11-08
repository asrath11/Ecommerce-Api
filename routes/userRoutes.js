const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Public Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protecting routes with the 'protect' middleware
router.use(authController.protect); // Protect all routes below this line
router.use(authController.restrictTo('admin')); // Protect all routes below this line

// Protected Routes for Admins Only
router.route('/').get(userController.getAllUsers); // Get all users (requires admin authentication)

router.route('/:id').get(userController.getUser); // Get user by ID (accessible to all authenticated users)

module.exports = router;
