const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/ecommerce/api/v1/users', userRouter);
app.use('/ecommerce/api/v1/products', productRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Failed',
    message: `cant find ${req.originalUrl} on the server`,
  });
});
module.exports = app;
