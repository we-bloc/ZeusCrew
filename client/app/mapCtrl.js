angular.module('roadtrippin.maps', ['gservice'])
  .controller('mapController', function($scope, mapFactory, gservice) {
    $scope.route = {};
    
    // $scope.formData.latitude = 39.500;
    // $scope.formData.longitude = -98.350;
    // gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
  });