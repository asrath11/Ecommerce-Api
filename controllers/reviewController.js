const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const path = require('path');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({ path: 'user', select: 'name email' })
      .populate('product');

    if (reviews.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No reviews found',
      });
    }

    res.status(200).json({
      status: 'success',
      length: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

// Create a new review for a specific product
exports.createReview = async (req, res) => {
  try {
    const { content } = req.body; // Assuming content, rating, and user are sent in the body
    req.body.product = req.params.productId;
    if (!req.body.content) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide content',
      });
    }
    const review = await Review.create({
      content,
      product: req.body.product,
      user: req.user.id,
    });
    res.status(201).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while creating the review',
    });
  }
};
