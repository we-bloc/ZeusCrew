angular.module('dashboard.factory', [])
  .factory('dashboardFactory', function($http, $q) {
    var getNotifications = function(){
      return $http({
        method: 'GET',
        url: '/myNotifications'
      })
    };

    var getUsers = function() {
      return $http({
        method: 'GET',
        url: '/myUsers'
      });
    };
    var sendRequest = function (userObj) {
      return $http({
        method: 'PUT',
        url: '/newRequest',
        data: userObj
      });
  };

    return {
      getNotifications: getNotifications,
      getUsers: getUsers,
      sendRequest: sendRequest
    };
  });