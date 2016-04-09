angular.module('roadtrippin.mapsFactory', [])

  .factory('mapFactory', function($http) {
    
    //send endpoints and array of waypoints to the server
    var saveJourneyWithWaypoints = function (tripObject) {
      console.log(JSON.stringify(tripObject))
      $http({
        method: 'POST',
        url: '/saveJourney',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        console.log(res);
      });
    };

    return {
      saveJourneyWithWaypoints: saveJourneyWithWaypoints
    };
  });

