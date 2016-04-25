angular.module('dashboard.profile', ['dashboard.profileFactory'])
  .controller('profileController', ['$scope', 'profileFactory',  function($scope, profileFactory){
    $scope.data = {};
    $scope.getProfile = function () {
      profileFactory.getMyProfile()
      .then(function (result) {
        $scope.data.profile = result;
      });
      profileFactory.getMyFriends()
        .then(function (results) {
          $scope.data.friends = results;
        });
    };

    $scope.getProfile();
    
  }]);


  