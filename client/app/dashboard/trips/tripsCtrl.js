angular.module('dashboard.trips', ['dashboard.tripsFactory'])
  .controller('tripsController', ['$scope', 'tripsFactory', function($scope, tripsFactory){
    $scope.myTrips = [];
    // Get all of the users trips
    var getTrips = function() {
      tripsFactory.getMyTrips().then(function(results) {
        $scope.myTrips = results;
      });
    };

    getTrips();
  }]);