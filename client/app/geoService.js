angular.module('gservice', [])
    .factory('gservice', function($http) {

      var googleMapService = {};

      // Functions
      // --------------------------------------------------------------

      // New refresh!
      googleMapService.refresh = function() {
        initialize();
      };

      // Initializes the map
      var map;
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();

      function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var SF = new google.maps.LatLng(37.7749, -122.4194);
        var mapOptions = {
          zoom: 7,
          center: SF
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        directionsDisplay.setMap(map);
      }

      // Refresh the page upon window load. Use the initial latitude and longitude
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh());

      //calculate a route
      googleMapService.calcRoute = function(start, end) {
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
        });
      };

      return googleMapService;
    });