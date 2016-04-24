var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');

var JourneySchema = new mongoose.Schema({
  startPoint: {
    type: String
  },
  endPoint: {
    type: String
  },
  wayPoints: {
    type: [String]
  },
  hash: {
    type: String
  },
  userID: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: [{user: String, text: String}]
  }
}, {timestamps: true});

var createSha = function (points) {
  var shasum = crypto.createHash('sha1');
  shasum.update(points);
  return shasum.digest('hex').slice(0, 5);
};

JourneySchema.pre('save', function(next) {
  var journey = this;
  var hash = createSha(journey.wayPoints.length.toString() + journey.startPoint + journey.endPoint);
  journey.hash = hash;
  next();
});

module.exports = mongoose.model('Journey', JourneySchema);
