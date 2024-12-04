const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');
const reviewRouter = require('./../routes/reviewRoutes');

router.use('/:productId/reviews', reviewRouter);
router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route('/:id').get(productController.getProduct);

module.exports = router;
