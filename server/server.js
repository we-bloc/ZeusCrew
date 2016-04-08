var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../client'));
app.use(parser.json());
app.use(morgan('dev'));


var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/roadtrippin';    
mongoose.connect(mongoUri)   
   
var db = mongoose.connection;    
db.on('error', console.error.bind(console, 'connection error:'));    
db.once('open', function() {   
  console.log('Mongoose is connected');    
});



var port = process.env.PORT || 8080;


app.listen(port, function() {
  console.log("Listening to: " + port);
});

module.exports = app;
