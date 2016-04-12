angular.module('roadtrippin.maps', ['gservice'])
  .controller('mapController', function($scope, mapFactory, gservice) {
    $scope.route = {};
    $scope.route.stopOptions = [1, 2, 3, 4, 5];
    $scope.places = [];
    $scope.savedRoutes = [];

    //this is a call to our Google maps API factory for directions
    $scope.getRoute = function() {
      gservice.calcRoute($scope.route.start, $scope.route.end, $scope.route.numStops)
        .then(function(places) {
          $scope.places = [];
          places.forEach(function(place) {
            place.address = place.address.split(', ')
            console.log(place.name);
            $scope.places.push(place);
          });
        });
    };

    $scope.saveRoute = function () {
      mapFactory.saveJourneyWithWaypoints(gservice.thisTrip).then($scope.getAll);
    };

    $scope.getAll = function () {
      mapFactory.getAllRoutes().then(function(results){
        $scope.savedRoutes = results;
      })
    }

    $scope.viewSavedRoute = function (hash) {
      for(var i = 0; i < $scope.savedRoutes.length; i++){
        if($scope.savedRoutes[i].hash === hash){
          var stops = [];
          for (var j = 0; j < $scope.savedRoutes[i].wayPoints.length; j++){
            stops.push({location: $scope.savedRoutes[i].wayPoints[j], stopover: true});
          }
          gservice.render($scope.savedRoutes[i].startPoint, $scope.savedRoutes[i].endPoint, stops);
        }
      }
    }

    $scope.getAll();
  });
