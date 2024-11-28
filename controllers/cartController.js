const Cart = require('../models/cartModel');
// const Product = require('../models/productModel');
exports.getMyCart = async (req, res) => {
  try {
    // Find the cart by userId and populate the products
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      'products.product'
    );

    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart not found',
      });
    }
    if (!cart.products) {
      return res.status(200).json({
        message: 'Your cart is empty',
      });
    }
    // Send back the populated cart
    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while fetching the cart',
    });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    let { product, quantity } = req.body;

    // Validate that product is provided
    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a productId',
      });
    }

    // If quantity is not provided or invalid, default to 1
    quantity = isNaN(quantity) || quantity <= 0 ? 1 : Number(quantity);

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart not found',
      });
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === product
    );

    if (productIndex !== -1) {
      // If product exists, update the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.products.push({ product, quantity });
    }

    // Save the updated cart
    await cart.save();

    // Re-populate the cart with product details after update
    await cart.populate('products.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while adding the product to the cart',
    });
  }
};
