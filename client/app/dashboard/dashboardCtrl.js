angular.module('dashboard', ['ngMaterial'])
  .controller('dashboardController', dashboardCtrl);
  

function dashboardCtrl ($timeout, $q, $http, dashboardFactory) {
  var self = this;

  // Pulls all users who aren't currently friends of active user
  self.users; 
  dashboardFactory.getUsers().then(function(users){
    self.users = users.data;
  });

  // This is the user that is selected from the dropdown
  self.selectedUser = null;
  // This is the current search text. Updates on keyup
  self.searchText = null;
  // This is the function call with searchText
  self.querySearch = querySearch;
  self.showSuccessAlert = false;

  // This toggles the success alert
  self.showSuccess = function () {
    self.showSuccessAlert = !self.showSuccessAlert;
  };

  //These are the functions that send the friend request
  self.sendRequest = function() {
    dashboardFactory.sendRequest(self.selectedUser).then(function(data) {
      self.showSuccess();
      socket.emit('sentNotif', data);
    });
  };


  // search the current searchText for a matching list of users
  function querySearch (query) {
    var results = query ? self.users.filter( createFilterFor(query) ) : self.states;
    var deferred = $q.defer();
    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
    return deferred.promise;
  };

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

