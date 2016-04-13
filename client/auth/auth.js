angular.module('roadtrippin.auth', [])

.controller('authController', function($scope, $window, $location, Auth) {
  $scope.user = {};
  
  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function() {
        
      })
      .catch(function(error) {
        console.error(error);
      });
  };
  
  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function() {
        
      })
      .catch(function(error) {
        console.error(error);
      });
  };
  
  $scope.signout = function() {
    Auth.signout();
  };
});