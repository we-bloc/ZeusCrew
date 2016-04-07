var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();
//mongoose.connect('mongodb://localhost/roadtrippin');

app.use(express.static(__dirname + '/../client'));
app.use(morgan('dev'));

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening to: " + port);
});

module.exports = app;
