const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database");
const urlRoutes = require("./routes/leaguesRouter.js");


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


