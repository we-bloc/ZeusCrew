angular.module('roadtrippin.maps', ['gservice'])
  .controller('mapController', function($scope, mapFactory, gservice) {
    $scope.route = {};

    //this is a call to our Google maps API factory for directions
    $scope.getRoute = function() {
      gservice.calcRoute($scope.route.start, $scope.route.end);
    };
  });