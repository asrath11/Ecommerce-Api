const express = require('express');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Swagger Documentation Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce platform.',
      contact: {
        name: 'Asrath',
        email: 'pasrath.2004@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // Server URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Points to the route files for documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
