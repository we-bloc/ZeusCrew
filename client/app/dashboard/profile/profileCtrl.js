angular.module('dashboard.profile', ['dashboard.profileFactory'])
  .controller('profileController', ['$scope', 'profileFactory',  function($scope, profileFactory){
    $scope.data = {};

    $scope.getProfile = function () {
      profileFactory.getMyProfile()
      .then(function (result) {
        $scope.data.profile = result;
      });
    };

    $scope.getProfile();
    
  }]);


  