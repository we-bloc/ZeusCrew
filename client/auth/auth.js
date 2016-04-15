angular.module('roadtrippin.auth', [])

.controller('authController', function($scope, $window, $location, authFactory) {
  $scope.user = {};
  
  $scope.signin = function() {
    authFactory.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.roadtrippin', token);
        $location.path('/');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
  
  $scope.signup = function() {
    authFactory.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.roadtrippin', token);
        $location.path('/');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
  
  $scope.signout = function() {
    authFactory.signout();
  };
});