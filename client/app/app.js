angular.module('roadtrippin', [
  'roadtrippin.maps',
  'roadtrippin.mapsFactory',
  'gservice',
  'roadtrippin.auth',
  'roadtrippin.authFactory',
  'ui.router', 
  'dashboard.profile',
  'dashboard.trips',
  'dashboard',
  'ngAria',
  'ngMaterial',
  'ngAnimate'
])
.controller('mainController', ['$scope','mapFactory', function($scope,mapFactory){
  $scope.signout = function () {
    mapFactory.signout();
  };
}])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/homepage');

  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: './../app/auth/signin.html',
      controller: 'authController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: './../app/auth/signup.html',
      controller: 'authController'
    })
    .state('homepage', {
      url: '/homepage',
      templateUrl: './../app/map/homepage.html',
      controller: 'mapController',
      authenticate: true
    })
    .state('dashboard', {
      url:'/dashboard',
      views: {
        '': { 
          templateUrl: './../app/dashboard/dashboard.html',
          controller: 'dashboardController' 
        },
        'profile@dashboard': {
          templateUrl: './../app/dashboard/profile/profile.html',
          controller: 'profileController'
        },
        // 'requests@dashboard': {
        //   templateUrl: './../app/dashboard/requests/requests.html',
        //   controller: 'requestsController'
        // },
        'trips@dashboard': {
          templateUrl: './../app/dashboard/trips/trips.html',
          controller: 'tripsController'
        }
        // NEED TO ADD createProject
      }
    });

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.roadtrippin');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, authFactory, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if (toState && toState.authenticate && !authFactory.isAuth()) {
      $location.url('/signin');
    } else if (toState && toState.authenticate && authFactory.isAuth()) {
      $location.url('/homepage');
    }
  });
});