angular.module('dashboard.tripsFactory', [])

  .factory('tripsFactory', function($http, $q, $window, $location) {
    // Get a list of the users trips
    var getMyTrips = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/myTrips'
      }).then(function (res) {
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    var addMessage = function(msgData) {
      return $http({
        method: 'PUT',
        url: '/messages',
        data: msgData
      });
    };

    return {
      getMyTrips: getMyTrips,
      addMessage: addMessage
    };
  });
