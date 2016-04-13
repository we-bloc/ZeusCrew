angular.module('roadtrippin.authFactory', [])

.factory('authFactory', function($http, $location, $window) {
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function(resp) {
      return resp.data;
    });
  };
  
  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(resp) {
      return resp.data;
    });
  };
  
  var signout = function() {
    
  };
  
  return {
    signin: signin,
    signup: signup,
    signout: signout
  }
});