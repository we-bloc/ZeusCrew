angular.module('dashboard', ['ngMaterial'])
  .controller('dashboardController', dashboardCtrl)
  .factory('dashboardFactory', function($http, $q) {
    var getNotifications = function(){
      //HTTP request to get users notifications
      //Promise
      return $http({
        method: 'GET',
        url: '/myNotifications'
      })
    };

    var getUsers = function() {
      console.log('Is this running?')
      return $http({
        method: 'GET',
        url: '/myUsers'
      });
    };
    var sendRequest = function (userObj) {
      $http({
        method: 'PUT',
        url: '/newRequest',
        data: userObj
      }).then(function(){
        console.log(userObj);
      })
  };

    return {
      getNotifications: getNotifications,
      getUsers: getUsers,
      sendRequest: sendRequest
    };
  });

function dashboardCtrl ($timeout, $q, $http, dashboardFactory) {
  var self = this;

  self.users; 

  dashboardFactory.getUsers().then(function(users){
    console.log(users.data);
    self.users = users.data;
  });

  self.selectedUser = null;
  self.searchText = null;
  self.querySearch = querySearch;
  self.showSuccessAlert = false;


  self.showSuccess = function () {
    self.showSuccessAlert = !self.showSuccessAlert;
  };

  //These are the functions that send the friend request
  self.sendRequest = function() {
    dashboardFactory.sendRequest(self.selectedUser);
  };


  // search the current searchText for a matching list of users
  function querySearch (query) {
    var results = query ? self.users.filter( createFilterFor(query) ) : self.states;
    var deferred = $q.defer();
    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
    return deferred.promise;
  };

  // http request to server... will return all non-friended users

  // creates a filter function for a query string
  function createFilterFor (query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(user) {
      //Create lowercase versions of all searcheable data
      var firstName = angular.lowercase(user.firstname);
      var lastName = angular.lowercase(user.lastname);
      var userName = angular.lowercase(user.username);

      // return an array of objects that include the query
      return (firstName.includes(lowercaseQuery) || 
              lastName.includes(lowercaseQuery) ||
              userName.includes(lowercaseQuery));
    };
  };
};

