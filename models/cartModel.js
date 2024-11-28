const mongoose = require('mongoose');

// Define the cart schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ensure a user is always associated with a cart
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true, // Ensure the product is always defined
        },
        quantity: {
          type: Number,
          default: 1, // Default to 1 if not provided
          min: [1, 'Quantity cannot be less than 1'], // Ensure quantity is at least 1
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
cartSchema.index({ userId: 1 });
cartSchema.index({ 'products.product': 1 });
// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
