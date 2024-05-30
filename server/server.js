const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database");
const urlRoutes = require("./routes/leaguesRouter.js");
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173'||"https://transfermarkt-monitoring-tool-m6g0zflzt-milen1017s-projects.vercel.app/", // Replace with your front-end URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Use routes
app.use(urlRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
