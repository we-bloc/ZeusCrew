var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');
var userController = require('./users/userController.js');
var journeyController = require('./journey/journeyController.js');

var app = express();

app.use(express.static(__dirname + '/../client'));
app.use(parser.json());
app.use(morgan('dev'));


var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/roadtrippin';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});
  
// Grab only the logged in users trips
app.get('/myTrips', journeyController.getTrips);
//Grab user profile
app.get('/myProfile', userController.getProfile);
app.get('/myFriends', userController.getFriends);
app.post('/saveJourney', journeyController.saveJourney);
app.get('/saveJourney', journeyController.getAll);
app.put('/messages', journeyController.addMsg);
app.post('/signin', userController.signin);
app.post('/signup', userController.signup);
app.put('/newRequest', userController.sendFriendRequest);
app.put('/reqResponse', userController.handleFriendRequest);
app.get('/myUsers', userController.sendNonFriendUsers);
app.get('/myNotifications', userController.getNotifications);
app.put('/purgeReqs', userController.purgeReqs);
app.use(userController.errorHandler);

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
