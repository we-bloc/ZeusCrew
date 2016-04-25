angular.module('dashboard.profileFactory', [])

  .factory('profileFactory', function ($http, $q) {
    var getMyProfile = function () {
      return $http({
        method: 'GET',
        url: '/myProfile'
      });
      
    };
    return {
      getMyProfile: getMyProfile
    };
  });