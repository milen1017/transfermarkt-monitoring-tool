const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require('./database');
const Url = require('./models/Url');

const app = express();
const scrapeTransfers = require("./scraper.js");

// Connect to MongoDB
connectDB();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Route to handle incoming URL
app.post("/api/url", async (req, res) => {
  const { url, leagueName, id } = req.body;
  
  try {
    // Save the data to MongoDB
    const newUrl = new Url({
      url,
      leagueName,
      id
    });
    
    await newUrl.save();
    
    // Optionally, you can call your scrape function here
    // scrapeTransfers(url, id);

    console.log("Received URL:", url, "name", leagueName, "id", id);

    // Sending back a response for demonstration purposes
    res.send(`Received URL: ${url}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
