angular.module('roadtrippin.auth', [])

.controller('authController', function($scope, $window, $location, authFactory) {
  $scope.user = {};
  
  $scope.signin = function(valid) {
    if (valid) {
      authFactory.signin($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.roadtrippin', token);
            $location.path('/');
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };
  
  $scope.signup = function(valid) {
    if (valid) {
      authFactory.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.roadtrippin', token);
            $location.path('/');
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };
});