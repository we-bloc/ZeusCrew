var express = require('express');
var util = require('../lib/utility');
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');

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

// Session Support /////////

var session = require('express-session');
app.use(session({
  secret: '98u20kladsjfaklsjfjwe2303209',
  resave: false,
  saveUninitialized: true 
}));

app.get('/', util.checkUser, function(req, res) {
  res.render('index');
})

app.post('/saveJourney', util.checkUser, journeyController.saveJourney);
app.get('/saveJourney', util.checkUser, journeyController.getAll);

var port = process.env.PORT || 8080;


app.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
