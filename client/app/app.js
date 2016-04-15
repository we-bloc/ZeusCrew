angular.module('roadtrippin', [
  'roadtrippin.maps',
  'roadtrippin.mapsFactory',
  'gservice'
  // 'roadtrippin.authFactory',
  // 'ngRoute'
])

// .config(function($routeProvider, $httpProvider) {
//   $routeProvider
//     .when('/', {
//       authenticate: true,
//       templateUrl: 'app/auth/.html'
//     })
//     .when('/signin', {
//       templateUrl: 'app/auth/signin.html',
//       controller: 'authController'
//     })
//     .when('signup', {
//       templateUrl: 'app/auth/signup.html',
//       controller: 'authController'
//     })
//     .otherwise({
//       redirectTo: '/'
//     });
    
//     // We add our $httpInterceptor into the array
//     // of interceptors - middleware for the ajax calls
//     $httpProvider.interceptors.push('AttachTokens');
// })

// .factory('AttachTokens', function ($window) {
//   // this is an $httpInterceptor, its job is to stop all outgoing requests, then look in local storage and find the user's token. 
//   // Adds it to the header so the server can validate the request
//   var attach = {
//     request: function(object) {
//       var jwt = $window.localStorage.getItem('com.roadtrippin');
//       if(jwt) {
//         object.headers['x-access-token'] = jwt;
//       }
//       object.headers['Allow-Control-Allow-Origin'] = '*';
//       return object;
//     }
//   };
//   return attach;
// })

// .run(function($rootScope, $location, authFactory) {
//   // Here inside the run phase of angular, our services and controllers have just been registered and our app is ready.
//   // However, we want to make sure the user is authorized so we listen for when angular is trying to change routes.
//   // When it does change routes, we then look for the token in localStorage and send that token to the server to see if it is a real user or hasn't expired.
//   // If it's not valid, we then redirect back to signin/signup
//   $rootScope.$on('$routeChangeStart', function(evt, next, current) {
//     if(next.$$route && $$route.authenticate && !Auth.isAuth()) {
//       $location.path('/signin');
//     }
//   });
// });