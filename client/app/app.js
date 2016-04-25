angular.module('roadtrippin', [
  'roadtrippin.maps',
  'roadtrippin.mapsFactory',
  'gservice',
  'roadtrippin.auth',
  'roadtrippin.authFactory',
  'ui.router', 
  'dashboard.profile',
  'dashboard.trips',
  'dashboard.factory',
  'dashboard',
  'ngAria',
  'ngMaterial',
  'ngAnimate'
])

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
          controller: 'dashboardController',
          controllerAs: 'ctrl' 
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

.controller('mainController', ['$scope','mapFactory', 'dashboardFactory', '$mdDialog', '$mdMedia', function($scope,mapFactory,dashboardFactory,$mdDialog, $mdMedia){
  $scope.notifications;
  $scope.signout = function () {
    $scope.notifications = [];
    mapFactory.signout();
  };
  $scope.getNotifications = function() {
    dashboardFactory.getNotifications().then(function(pending){
      $scope.notifications = pending.data;
    });
  };

  socket.on('receivedNotif', $scope.getNotifications);

  $scope.getNotifications();

  $scope.reqResponse = function(bool) {
    dashboardFactory.reqResponse(bool).then(function(stuff) {
      socket.emit('reqResponse', stuff);
      $mdDialog.hide();
    });
  };

  function DialogController($scope, $mdDialog, notifs,reqResponse) {
    $scope.notifs = notifs;
    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
    $scope.reqResponse = reqResponse;
  };

  $scope.showNotifications = function($event) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      template: 
          '<md-dialog aria-label="List dialog">' +
           '  <md-dialog-content>'+
           '    <md-list>'+
           '      <md-list-item ng-repeat="item in notifs track by $index">'+
           '       <p class="notification">New Friend Request from: {{item.firstname}} {{item.lastname}}</p>' +
           '    <md-button ng-click="reqResponse( {accepted:true,_id:item._id })" class="md-primary">' +
           '      Accept' +
           '    </md-button>' +
           '    <md-button ng-click="reqResponse({accepted:false,_id:item._id})" class="md-primary">' +
           '      Decline' +
           '    </md-button>' +
           '      '+
           '    </md-list-item></md-list>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Close Dialog' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
      locals: {
        notifs: $scope.notifications,
        reqResponse: $scope.reqResponse
      },
      controller: DialogController
    })
  }
}])

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