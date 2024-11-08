const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  ratings: {
    type: Number,
    min: 1,
    max: 5,
    message: 'Ratings should be less than or equals to 5',
  },
  image: {
    type: String,
  },
});

const product = mongoose.model('Product', productSchema);

module.exports = product;
