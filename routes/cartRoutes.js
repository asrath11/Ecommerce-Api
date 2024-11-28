const express = require('express');
const router = express.Router();
const cartController = require('./../controllers/cartController');
const authController = require('./../controllers/authController');

router.get('/', authController.protect, cartController.getMyCart);
router.post('/', authController.protect, cartController.addProductToCart);

module.exports = router;
