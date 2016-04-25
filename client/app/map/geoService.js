angular.module('gservice', [])
    .factory('gservice', function ($http, $q, mapFactory) {

      var googleMapService = {};

      // Set-up functions
      // --------------------------------------------------------------

      // Initialize the map
      var map, directionsDisplay;
      var directionsService = new google.maps.DirectionsService();

      //Store current trip data so we can access it for saving.
      //Properties will be added to this object every time a route is calculated.
      googleMapService.thisTrip = {};

      //initialize the map if no other instructions are given
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

      // Refresh, to re-initialize the map.
      googleMapService.refresh = function () {
        initialize();
      };

      // Refresh the page upon window load.
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh());


      // Navigation functions - Google directions service
      // --------------------------------------------------------------

      //calculate a route (promisified function)
      googleMapService.calcRoute = function (start, end, numStops) {
        var deferred = $q.defer();
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            // grab official start and end points for later use
            var officialStart = result.routes[0].legs[0].start_address;
            var officialEnd = result.routes[0].legs[0].end_address;
            //format and send request for the same trip but with waypoints
            var stops = [];
            var waypoints = getWaypoints(result.routes[0].overview_path, numStops);
            var promise = getNearbyThings(waypoints); //testing testing
            promise.then(function (placePoints) {
              googleMapService.render(officialStart, officialEnd, placePoints)
              .then(function () {
                deferred.resolve(googleMapService.thisTrip.waypoints);
              });
            });
          }
        });
        return deferred.promise;
      };

      //render a complete journey (promisified function)
      googleMapService.render = function (start, end, waypoints) {
        var deferred = $q.defer();
        //make route points accessable to other functions
        googleMapService.thisTrip.start = start;
        googleMapService.thisTrip.end = end;
        googleMapService.thisTrip.waypoints = waypoints;
        var stops = []; //format stops for Google request
        waypoints.forEach(function (object) {
          if(!object.location) {
            object.location = object.formatted_address;
          }
          stops.push({
            location: object.location,
            stopover: true
          });
        });
        var wyptRequest = { //format the request for Google
          origin: start,
          destination: end,
          waypoints: stops,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(wyptRequest, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            sortWaypoints(response.routes[0].waypoint_order);
            deferred.resolve(waypoints);
          }
        });
        return deferred.promise;
      };


      // Waypoint functions - Google places service
      // --------------------------------------------------------------

      // get waypoints by breaking up trip into even-ish segments
      var getWaypoints = function (waypointArray, numStops) {
        var points = [];
        var stopDistance = Math.floor(waypointArray.length / (numStops + 1));
        for (i = 0; i < numStops; i++) {
          points.push(stopDistance + (stopDistance * i));
        }
        var waypoints = [];
        points.forEach(function (index) { //retrieve lat/lng data for each wpt
          var waypoint = {
            lat: waypointArray[index].lat(),
            lng: waypointArray[index].lng()
          };
          waypoints.push(waypoint);
        });
        return waypoints;
      };

      //Promisified function that returns objects that can be used to request info from the Maps API
      var placeRequests = function(waypointArray, distance, type) {
        return $q(function(resolve, reject) {
          resolve(waypointArray.map(function(waypoint){
            return {
              location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
              radius: distance || '500',
              query: type || 'restaurant'
            }
          }))
        });
      };

      // Promisified function that queries google for all possible restaurants
      var googleQuery = function(request) {
        var placesService = new google.maps.places.PlacesService(document.getElementById('invisible'), request.location);
        return $q(function(resolve, reject) {
         placesService.textSearch(request, function(results, status) {
          getBestRated(results, status, placesService,function(data){
            resolve(data);
          });
          });
        });   
      };

      // Callback function that returns the best rated restaurants
      function getBestRated(results, status, service, cb) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var bestRated = 0; 
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            if(place.rating > bestRated) {
              bestRated = place;
            };
          };
          getSweetDeets(bestRated, service)
            .then(function(data) {
              cb(data);
            });
          // return bestRated;
        }
      };

      function getSweetDeets (location, service) {
        var id = location.place_id; 
        return $q(function(resolve, reject) {
          service.getDetails({
            placeId: id,
          }, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              resolve(place);
            };
          });
        }) 
      };

      //get a single nearby attraction for each waypoint (promisified function)
      var getNearbyThings = function (waypointArray, distance, type) {
        return $q(function(resolve, reject) {
          placeRequests(waypointArray)
            .then(function(requestsArray) {
                //requestsArray is good
              var arr = [];
              $q(function(resolve, reject) {
                requestsArray.forEach(function(request) {
                  googleQuery(request).then(function(data){
                    arr.push(data);
                    if(arr.length === requestsArray.length) {
                      resolve(arr);
                    }
                  });
                });
              }).then(function(data) {
                resolve(data);
              })
            });  
        })
      };

      //Record order in 'position' property of each waypoint
      var sortWaypoints = function (waypointOrder) {
        for (var i = 0; i < googleMapService.thisTrip.waypoints.length; i++) {
          var waypoint = googleMapService.thisTrip.waypoints[i];
          var position = waypointOrder[i];
          waypoint.position = position;
        }
        return;
      };

      return googleMapService;
    });
