const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database");
const Url = require("./models/Url");
const Transfer = require("./models/Transfer");
const urlRoutes = require("./routes/leaguesRouter.js");
const { scrapeAndSaveAllLeagues } = require("./utils.js");

const app = express();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(cors());
app.use(urlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Endpoint to trigger scraping and saving transfers for all leagues
app.post("/api/scrape-transfers", async (req, res) => {
  try {
    await scrapeAndSaveAllLeagues();
    res
      .status(200)
      .send("Scraping and saving transfers completed successfully.");
  } catch (error) {
    console.error("Error during scraping and saving transfers:", error);
    res.status(500).send("Error during scraping and saving transfers.");
  }
});
