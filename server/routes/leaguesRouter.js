const express = require("express");
require("dotenv").config();
const Url = require("../models/Url");
const Transfer = require("../models/Transfer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const { scrapeAndSaveAllLeagues } = require("../utils");

const router = express.Router();

// Endpoint to trigger scraping and saving transfers for all leagues
router.post("/api/scrape-transfers", async (req, res) => {
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

// Route to handle incoming URL
router.post("/api/url", async (req, res) => {
  const { url, leagueName, id } = req.body;

  try {
    const newUrl = new Url({
      url,
      leagueName,
      id,
    });

    await newUrl.save();

    console.log("Received URL:", url, "name", leagueName, "id", id);

    res.send(`Received URL: ${url}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch all saved leagues
router.get("/api/leagues", async (req, res) => {
  try {
    const leagues = await Url.find();
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

router.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      password, // This will trigger the pre-save hook to hash the password
    });

    await user.save();

    console.log('User registered:', user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
});

// Login Route



router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return res.json({
        _id: user._id,
        username: user.username,
        token, // Include token in the response for frontend storage
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


router.get('/api/auth/check-auth', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id).select('-password').then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      res.json({ token, user });
    });
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


router.post('/api/auth/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out' });
});


module.exports = router;
