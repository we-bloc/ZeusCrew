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
          //copy the places array before we start splitting things so our original stays in-tact
          var placesCopy = [];
          for (var i = 0; i < places.length; i++) {
            //this apparently is needed for a clean copy...
            placesCopy.push(JSON.parse(JSON.stringify(places[i])));
          }
          placesCopy.forEach(function(place) { //split address for easier formatting
            place.location = place.location.split(', ');
            $scope.places.push(place);
          });
          console.log($scope.places)
        });
    };

    $scope.getLetter = function (i) {
      return String.fromCharCode(i + 66);
    };

    $scope.saveRoute = function () {
      mapFactory.saveJourneyWithWaypoints(gservice.thisTrip).then($scope.getAll());
    };

    $scope.getAll = function () {
      mapFactory.getAllRoutes().then(function(results) {
        $scope.savedRoutes = results;
      });
    };

    $scope.viewSavedRoute = function (hash) {
      for (var i = 0; i < $scope.savedRoutes.length; i++) {
        if ($scope.savedRoutes[i].hash === hash) {
          var stops = [];
          for (var j = 0; j < $scope.savedRoutes[i].wayPoints.length; j++) {
            stops.push({location: $scope.savedRoutes[i].wayPoints[j], stopover: true});
          }
          $scope.places = stops;
          console.log(stops)
          gservice.render($scope.savedRoutes[i].startPoint, $scope.savedRoutes[i].endPoint, stops);
        }
      }
    };

    $scope.getAll();
  });
