angular.module('gservice', [])
    .factory('gservice', function($http) {

      var googleMapService = {};
      var locations = [];

      //Starting location (from tutorial, maybe discardable)
      var selectedLat = 39.50;
      var selectedLong = -98.35;

      // Functions
      // --------------------------------------------------------------
      // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
      googleMapService.refresh = function(latitude, longitude) {
        locations = [];
        selectedLat = latitude;
        initialize(latitude, longitude);
      };

      // Initializes the map
      var initialize = function(latitude, longitude) {

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};

        // If map has not been created already...
        if (!map) {

          // Create a new map and place in the index.html page
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
          });
        }
        // don't know if we need to keep this one
        // Loop through each location in the array and place a marker
        locations.forEach(function(n, i) {
          var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          });

          // For each marker created, add a listener that checks for clicks
          google.maps.event.addListener(marker, 'click', function(e) {

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
          });
        });

        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
          position: initialLocation,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        lastMarker = marker;

      };

      // Refresh the page upon window load. Use the initial latitude and longitude
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh(selectedLat, selectedLong));

      return googleMapService;
    });