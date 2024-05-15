const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  fromTeam: {
    type: String,
    required: true
  },
  toTeam: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;