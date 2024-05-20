const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require('./database');
const Url = require('./models/Url');
const urlRoutes = require('./routes/leaguesRouter.js')

const app = express();
const scrapeTransfers = require("./scraper.js");

// Connect to MongoDB
connectDB();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

app.use(urlRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
