const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database");
const Url = require("./models/Url");
const Transfer = require("./models/Transfer");
const urlRoutes = require("./routes/leaguesRouter.js");
const { scrapeTransfers, saveTransfersToDB } = require('./utils.js');

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
app.post('/api/scrape-transfers', async (req, res) => {
  try {
    await scrapeAndSaveAllLeagues();
    res.status(200).send('Scraping and saving transfers completed successfully.');
  } catch (error) {
    console.error('Error during scraping and saving transfers:', error);
    res.status(500).send('Error during scraping and saving transfers.');
  }
});

const scrapeAndSaveAllLeagues = async () => {
  try {
    const leagues = await Url.find();
    for (const league of leagues) {
      const { url, id: leagueID } = league;
      console.log(`Scraping transfers for league ${leagueID}...`);
      const transfers = await scrapeTransfers(url, leagueID);
      await saveTransfersToDB(transfers, leagueID);
    }
    console.log('Scraping and saving transfers for all leagues completed.');
  } catch (error) {
    console.error('Error during scraping and saving transfers for all leagues:', error);
  }
};

// Endpoint to get transfers by league ID
app.get('/api/transfers/:leagueID', async (req, res) => {
  const { leagueID } = req.params;
  try {
    const transfers = await Transfer.find({ leagueID });
    res.status(200).json(transfers);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    res.status(500).send('Error fetching transfers.');
  }
});

// Endpoint to update the checked status of a transfer by its ID
app.put('/api/transfers/:transferID', async (req, res) => {
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
      res.status(404).send('Transfer not found.');
    }
  } catch (error) {
    console.error('Error updating transfer:', error);
    res.status(500).send('Error updating transfer.');
  }
});

