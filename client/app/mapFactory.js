angular.module('roadtrippin.mapsFactory', [])

  .factory('mapFactory', function($http) {
    
    //send endpoints and array of waypoints to the server
    var saveJourneyWithWaypoints = function (tripObject) {
      $http({
        method: 'POST',
        url: '/saveJourney',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        console.log('DATA SENT: ', res);
      }).catch(function (err) {
        console.log('ERROR FOUND: ', err);
      });
    };

    return {
      saveJourneyWithWaypoints: saveJourneyWithWaypoints
    };
  });

