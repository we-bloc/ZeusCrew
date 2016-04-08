var Q = require('q');
var Route = require('./routesModel.js');

var findRoute = Q.nbind(Route.findOne, Route);
var createRoute = Q.nbind(Route.create, Route);

module.exports = {
  saveRoute: function (journey) {
    var route = journey;

    findRoute({route: route})
      .then(function(route){
        if(route){
          next(new Error('Route already exist!'));
        }else{
          return createRoute({
            route: route
          });
        }
      })
      .fail(function(error){
        next(error);
      });
  }
};