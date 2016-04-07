var mongoose = require('mongoose');

var RouteSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Route', RouteSchema);