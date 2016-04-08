var Q = require('q');
var Journey = require('./JourneysModel.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

module.exports = {
  saveJourney: function (journey) {
    var journey = journey;

    findJourney({journey: journey})
      .then(function(journey){
        if(journey){
          next(new Error('Journey already exist!'));
        }else{
          return createJourney({
            journey: journey
          });
        }
      })
      .fail(function(error){
        next(error);
      });
  }
};