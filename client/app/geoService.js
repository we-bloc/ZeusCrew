angular.module('gservice', [])
    .factory('gservice', function($http, $q, mapFactory) {

      var googleMapService = {};

      // Functions
      // --------------------------------------------------------------

      // Initialize the map
      var map, directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      // var placesService = new google.maps.places.PlacesService();

      var initialize = function () {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var SF = new google.maps.LatLng(37.7749, -122.4194);
        var mapOptions = {
          zoom: 7,
          center: SF
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);
      };

      //Store current trip data so we can access it for saving.
      //Properties will be added to this object every time a route is calculated.
      googleMapService.thisTrip = {};

      //get waypoints
      var getWaypoints = function (waypointArray, numStops) {
        var points = [];
        var stopDistance = Math.floor(waypointArray.length / (numStops + 1));
        for (i = 0; i < numStops; i++) {
          points.push(stopDistance + (stopDistance * i));
        }

        //initialize an empty array to hold our waypoints
        var waypoints = [];
        points.forEach(function (index) {
          //each waypoint will be an object with a lat and lng
          var waypoint = {
            lat: waypointArray[index].lat(),
            lng: waypointArray[index].lng()
          };
          waypoints.push(waypoint);
        });
        googleMapService.thisTrip.waypoints = waypoints;
        return waypoints;
      };

      //get a single nearby attraction for each waypoint
      var getNearbyThings = function (waypointArray, distance, type) {
        //async function, so we need a promise here:
        var deferred = $q.defer();
        var placesToStop = [];
        //build out an array of requests
        var placeRequests = [];
        waypointArray.forEach(function(w) {
          placeRequests.push({
            location: new google.maps.LatLng(w.lat, w.lng),
            radius: distance || '500',
            query: type || 'restaurant'
          });
        });
        //query the google places service
        var doneSoFar = 0; //counter for async
        for (var i = 0; i < placeRequests.length; i ++) {
          var placesService = new google.maps.places.PlacesService(document.getElementById('invisible'), placeRequests[i].location);
          placesService.textSearch(placeRequests[i], function(res, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              var place = {
                address: res[0].formatted_address,
                name: res[0].name
              }
              placesToStop.push(place);
              doneSoFar ++;
              if (doneSoFar === placeRequests.length) {
                deferred.resolve(placesToStop);
              }
            } else {
              deferred.reject('we had a problem');
            }
          });
        }
        return deferred.promise;
      };

      // Refresh, to re-initialize the map.
      // New data could be passed to initialize here
      googleMapService.refresh = function () {
        initialize();
      };

      // Refresh the page upon window load.
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh());

      //calculate a route
      googleMapService.calcRoute = function (start, end, numStops) {
        var deferred = $q.defer();
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route (request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            
            //save start and end points for later use
            googleMapService.thisTrip.start = result.routes[0].legs[0].start_address;
            googleMapService.thisTrip.end = result.routes[0].legs[0].end_address;

            //format and send request for the same trip but with waypoints
            var stops = [];
            var waypoints = getWaypoints(result.routes[0].overview_path, numStops);
            var promise = getNearbyThings(waypoints); //testing testing
            promise.then(function(placePoints) {
              // mapFactory.listPlaces(placePoints);
              placePoints.forEach(function (w) {
                stops.push({
                  location: w.address,
                  stopover: true
                });
              });
              var wyptRequest = {
                origin: start,
                destination: end,
                waypoints: stops,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
              };
              directionsService.route(wyptRequest, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                  var route = response.routes[0];
                  deferred.resolve(placePoints);
                }
              });
            });
          }
        });
        return deferred.promise;
      };


      return googleMapService;
    });