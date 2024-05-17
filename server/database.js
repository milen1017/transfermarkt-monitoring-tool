
const mongoose = require('mongoose');

const DB_CONNECTION =
  "mongodb+srv://mnkrumov:hDiVSiXh4XjqtTa@cluster1.fyol5ul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const connectDB = async () => {
    try {
      await mongoose.connect(`${DB_CONNECTION}`);
      console.log('MongoDB connected');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;