const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const scrapeTransfers = require("./scraper.js");

// Middleware to parse JSON body
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Route to handle incoming URL
app.post("/api/url", (req, res) => {
  const { url, leagueName, id } = req.body;
  // Do something with the URL (e.g., store it in a database, fetch data from it, etc.)
  scrapeTransfers(url, id);
  console.log("Received URL:", url, "name", leagueName, "id", id);
  // Sending back a response for demonstration purposes
  res.send(`Received URL: ${url}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
