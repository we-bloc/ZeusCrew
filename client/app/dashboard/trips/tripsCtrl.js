angular.module('dashboard.trips', ['dashboard.tripsFactory'])
  .controller('tripsController', ['$scope', 'tripsFactory', function($scope, tripsFactory){
    $scope.myTrips = [];
    $scope.msg = {};
    // Get all of the users trips

    $scope.toggle = function(trip) {
      trip.showComments = !trip.showComments;
    };

    $scope.sendComment = function(project) {
      var details = {
        pid: project._id,
        text: $scope.msg.text
      };
      tripsFactory.addMessage(details).then(function(data) {
        console.log(data);
        socket.emit('msgSent', data);
      });
    };

    socket.on('msgReceived', function(data) {
      console.log(data);
      getTrips();
    });

    var getTrips = function() {
      tripsFactory.getMyTrips().then(function(results) {
        $scope.myTrips = results.map(function(item) {
          item.showComments = false;
          return item;
        });
        console.log($scope.myTrips);
      });
    };

    getTrips();
  }]);