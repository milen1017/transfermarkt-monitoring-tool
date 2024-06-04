const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database");
const urlRoutes = require("./routes/leaguesRouter.js");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();
const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';

app.use(bodyParser.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Use routes
app.use(urlRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
