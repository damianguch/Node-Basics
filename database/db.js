const mongoose = require('mongoose');

const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(url);

    console.log(`Connection to mongodb successfull!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
