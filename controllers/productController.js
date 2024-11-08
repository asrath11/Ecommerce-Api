const Product = require('./../models/productModel');
// controllers/userController.js
exports.getAllProducts = async (req, res) => {
  try {
    // Logic to fetch all users from the database
    console.log(req.query);
    const products = await Product.find(); // Assuming you have a User model
    res.status(200).json({
      status: 'success',
      length: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({
      status: 'success',
      user: product,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, price, rating, stock } = req.body;
    const product = await Product.create({
      name,
      category,
      price,
      rating,
      stock,
    });
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
