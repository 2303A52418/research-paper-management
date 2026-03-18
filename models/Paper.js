const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: String,
  year: Number,
  file: String
});

module.exports = mongoose.model('Paper', paperSchema);