angular.module('roadtrippin.mapsFactory', [])

  .factory('mapFactory', function($http, $q) {

    //send endpoints and array of waypoints to the server
    var saveJourneyWithWaypoints = function (tripObject) {
      console.log('trip Object', tripObject);
      var deferred = $q.defer ();
      $http({
        method: 'POST',
        url: '/saveJourney',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        deferred.resolve (res);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    var getAllRoutes = function(){
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/saveJourney'
      }).then(function (res){
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    return {
      saveJourneyWithWaypoints: saveJourneyWithWaypoints,
      getAllRoutes: getAllRoutes
    };
  });
