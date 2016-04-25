angular.module('dashboard.profileFactory', [])

  .factory('profileFactory', function ($http, $q) {
    var getMyProfile = function () {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/myProfile'
      })
      .then(function (res) {
        deferred.resolve (res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    return {
      getMyProfile: getMyProfile
    };
  });