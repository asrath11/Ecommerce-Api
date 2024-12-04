const Cart = require('../models/cartModel');
const Product = require('../models/productModel'); // Make sure you have this import

exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      'products.product',
      'name price'
    ); // Limiting fields populated
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Your cart is empty',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { cart },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while fetching the cart',
    });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    let { product, quantity } = req.body;

    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a productId',
      });
    }

    quantity =
      isNaN(quantity) || quantity <= 0 ? 1 : Math.max(1, Number(quantity));

    const validProduct = await Product.findById(product);
    if (!validProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid product ID',
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      const newCart = new Cart({
        userId: req.user._id,
        products: [{ product, quantity }],
      });
      await newCart.save();
      return res.status(201).json({
        status: 'success',
        data: { cart: newCart },
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === product
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product, quantity });
    }

    await cart.save();
    await cart.populate('products.product', 'name price'); // Populate product details

    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while adding the product to the cart',
    });
  }
};
