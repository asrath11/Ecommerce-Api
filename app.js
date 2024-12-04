const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// API Routes
app.use('/ecommerce/api/v1/users', userRouter);
app.use('/ecommerce/api/v1/products', productRouter);
app.use('/ecommerce/api/v1/carts', cartRouter);
app.use('/ecommerce/api/v1/reviews', reviewRouter);

// Handle Unmatched Routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'Failed',
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

module.exports = app;
