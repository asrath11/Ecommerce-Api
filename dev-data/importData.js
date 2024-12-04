const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

const connectDb = async function () {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to Database');
  } catch (e) {
    console.log('Error occurred while connecting to Database');
  }
};

connectDb();
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf8')
);
const importData = async function () {
  await User.create(users, { validateBeforeSave: false });
  await Product.create(products);
  await Review.create(reviews);
  console.log('Successfully imported');
};
const deleteData = async function () {
  await User.deleteMany();
  await Product.deleteMany();
  await Review.deleteMany();
  console.log('Successfully deleted');
};
if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
