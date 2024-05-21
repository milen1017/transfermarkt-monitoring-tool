const express = require("express");
const Url = require("../models/Url");
const router = express.Router();
const Transfer = require("../models/Transfer");

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

// Endpoint to get transfers by league ID
router.get("/api/transfers/:leagueID", async (req, res) => {
  const { leagueID } = req.params;
  try {
    const transfers = await Transfer.find({ leagueID });
    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).send("Error fetching transfers.");
  }
});

// Endpoint to update the checked status of a transfer by its ID
router.put("/api/transfers/:transferID", async (req, res) => {
  const { transferID } = req.params;
  const { checked } = req.body;

  try {
    const updatedTransfer = await Transfer.findByIdAndUpdate(
      transferID,
      { checked },
      { new: true }
    );

    if (updatedTransfer) {
      res.status(200).json(updatedTransfer);
    } else {
      res.status(404).send("Transfer not found.");
    }
  } catch (error) {
    console.error("Error updating transfer:", error);
    res.status(500).send("Error updating transfer.");
  }
});

module.exports = router;
