const mongoose = require('mongoose');
const dotenv = require('dotenv');

// process.on('uncaughtException', (err) => {
//   console.log('Unhandled rejection');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const app = require('./app');
const connectToDatabase = async () => {
  try {
    const dbUri = `mongodb://localhost:27017/ecommerce`;
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

connectToDatabase();
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
