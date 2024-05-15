const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  name: String,
  url: String,
  id: String
});

module.exports = mongoose.model('URL', urlSchema);
