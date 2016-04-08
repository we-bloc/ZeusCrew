var mongoose = require('mongoose');

var JourneySchema = new mongoose.Schema({
  journey: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Journey', JourneySchema);
