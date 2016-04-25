angular.module('dashboard.profile', ['dashboard.profileFactory'])
  .controller('profileController', ['$scope', 'profileFactory',  function($scope, profileFactory){
    $scope.getProfile = function () {
      profileFactory.getMyProfile()
      .then(function (result) {
        $scope.profile = result.data;
      });
    };

    socket.on('refreshFriends', function() {
      console.log('Refreshing friends!');
      $scope.getProfile();
      console.log($scope.data);
    });

    $scope.getProfile();
    
  }]);


  