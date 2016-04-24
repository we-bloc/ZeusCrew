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
<<<<<<< 3b0ecd4098f44cba0d56f65f2e38676a4f9ee5ff
  };
=======
    };

    var reqResponse = function (bool) {
      return $http({
        method: 'PUT',
        url: '/reqResponse',
        data: bool
      });
    }
>>>>>>> (refactor) Add the dashboardFactory file

    return {
      getNotifications: getNotifications,
      getUsers: getUsers,
<<<<<<< 3b0ecd4098f44cba0d56f65f2e38676a4f9ee5ff
      sendRequest: sendRequest
=======
      sendRequest: sendRequest,
      reqResponse: reqResponse
>>>>>>> (refactor) Add the dashboardFactory file
    };
  });