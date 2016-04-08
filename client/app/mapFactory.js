angular.module('roadtrippin.mapsFactory', [])

  .factory('mapFactory', function($http) {

    var askGoogle = function(route) {

    };
      
     // {
      // origin: "Chicago, IL",
      // destination: "Los Angeles, CA",
      // travelMode: google.maps.TravelMode.DRIVING,
      // drivingOptions: {
      // departureTime: new Date(Date.now() + N),  // for the time N milliseconds from now.
      // trafficModel: "optimistic" 
     // }

// {
//   *origin: LatLng | String | google.maps.Place,
//   *destination: LatLng | String | google.maps.Place,
//   *travelMode: TravelMode,
//   transitOptions: TransitOptions,
//   drivingOptions: DrivingOptions,
//   unitSystem: UnitSystem,
//   waypoints[]: DirectionsWaypoint,
//   optimizeWaypoints: Boolean,
//   provideRouteAlternatives: Boolean,
//   avoidHighways: Boolean,
//   avoidTolls: Boolean,
//   region: String
// }


// https://developers.google.com/maps/documentation/javascript/
// function initMap() {
//   // Create a map object and specify the DOM element for display.
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     scrollwheel: false,
//     zoom: 8
//   });
// }
    return {
      askGoogle: askGoogle
    };
  });

