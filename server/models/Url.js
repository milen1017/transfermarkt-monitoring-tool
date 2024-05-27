const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  leagueName: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
