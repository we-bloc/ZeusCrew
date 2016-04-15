var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');
// var util = require('../client/lib/utility');
var path = require('path');
var authController = require('./auth/authC')

var journeyController = require('./journey/journeyController.js');

var app = express();

app.use(express.static(__dirname + '/../client'));
app.use(parser.json());
app.use(morgan('dev'));


var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/roadtrippin';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});
  
app.post('/saveJourney', journeyController.saveJourney);
app.get('/saveJourney', journeyController.getAll);

var port = process.env.PORT || 8080;


app.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
