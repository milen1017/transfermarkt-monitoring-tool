const express = require("express");
const Url = require('../models/Url');
const router = express.Router();

// Route to handle incoming URL
router.post("/api/url", async (req, res) => {
  const { url, leagueName, id } = req.body;

  try {
    // Save the data to MongoDB
    const newUrl = new Url({
      url,
      leagueName,
      id,
    });

    await newUrl.save();

    // Optionally, you can call your scrape function here
    // scrapeTransfers(url, id);

    console.log("Received URL:", url, "name", leagueName, "id", id);

    // Sending back a response for demonstration purposes
    res.send(`Received URL: ${url}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch all saved leagues
router.get("/api/leagues", async (req, res) => {
  try {
    const leagues = await Url.find(); // Fetch all documents in the Url collection
    res.json(leagues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});





module.exports = router;
