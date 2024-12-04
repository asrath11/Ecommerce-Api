const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    content: {
      // Renamed from 'reviews' to 'content'
      type: String,
      required: true, // Ensure a review is always provided
      minlength: 10, // Optional: enforce a minimum length for reviews
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true, // Ensure the review is always associated with a product
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ensure the review is always associated with a user
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes to optimize queries
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
