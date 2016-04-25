var Q = require('q');
var Journey = require('./journeyModel.js');
var jwt = require('jwt-simple');
var app = require('./../server.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

module.exports = {
  saveJourney: function (req, res, next) {
    var start = req.body.start;
    var end = req.body.end;
    var nickname = req.body.nickname;
    var waypoints = [];

    // Grab user token, get the users ID
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66'); 

    for (var i = 0; i < req.body.waypoints.length; i++) {
      waypoints[req.body.waypoints[i].position] = [req.body.waypoints[i].name, req.body.waypoints[i].formatted_address];
    }

    var waypointsCopy = [].concat.apply([], waypoints);
    waypoints = waypointsCopy;

    findJourney({wayPoints: waypoints})
      .then(function (waypoint) {
        if (!waypoint) {
          return createJourney({
            startPoint: start,
            endPoint: end,
            wayPoints: waypoints,
            userID: user._id,
            nickName: nickname
          });
        } else {
          next(new Error('Journey already exist!'));
        }
      })
      .catch(function (error) {
        next(error);
      });
  },

  getAll: function (req, res, next) {
    Journey.find({})
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function(error) {
        next(error);
      });
  },

  // Get all of the trips belonging to the signed in user
  getTrips: function (req, res, next) {
    // Grab user token, get the users ID
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');

    // Find the users journeys
    Journey.find({ userID: user._id })
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function (error) {
        next(error);
      });
  },

  addMsg: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    // Set up the data to push into the project
    var data = {user: user.username, text: req.body.text};

    // Find the project and add the data to it
    Journey.findById(req.body.pid).then(function(trip) {
      trip.comments.push(data);
      trip.save().then(function(newTrip) {
        console.log('comment saved');
      });
    });
    res.status(200).json(data);
  }
};
