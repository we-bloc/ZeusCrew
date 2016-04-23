angular.module('dashboard', ['ngMaterial'])
  .controller('dashboardController', dashboardCtrl)
  .factory('dashboardFactory', function($http) {
    var getNotifications = function(){
      //HTTP request to get users notifications
      //Promise
      return $http({
        method: 'GET',
        url: '/myNotifications'
      })
    };
    return {
      getNotifications: getNotifications
    };
  });

function dashboardCtrl ($timeout, $q, $http) {
  var self = this;
  // This populates with all non-friended users
  self.users = getUsers();

  /*self.users = [
  {
    firstName:'Mark',
    lastName: 'Keith',
    email: 'mark.r.keith@gmail.com',
    userName: 'mkeith121'
  }, 
  {
    firstName:'Mark',
    lastName: 'French',
    email: 'mark.french@gmail.com',
    userName: 'mfrench'
  }, 
  {
    firstName:'Phil',
    lastName: 'Clauss',
    email: 'phil.clauss@gmail.com',
    userName: 'philthyclauss'
  }, 
  {
    firstName:'Dan',
    lastName: 'Savage',
    email: 'dan.savage@gmail.com',
    userName: 'danthesavage'
  }, 
  {
    firstName:'Nassir',
    lastName: 'Zeinu',
    email: 'sexy.beast@gmail.com',
    userName: 'servermasterExtraordinaire'
  }, 
  {
    firstName:'Trevor',
    lastName: 'Pace',
    email: 'wonderful.man@gmail.com',
    userName: 'knowsAllTheThings'
  }]*/

  self.selectedUser = null;
  self.searchText = null;
  self.querySearch = querySearch;
  self.showSuccessAlert = false;

  self.testFunc = function() {
    console.log(self.selectedUser);
    self.selectedUser = null;
    self.searchText = null;
    self.showSuccess();
  };

  self.showSuccess = function () {
    self.showSuccessAlert = !self.showSuccessAlert;
  };

  //These are the functions that send the friend request

  self.sendRequest = sendRequest;

  function sendRequest (userObj) {
    var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: '/newRequest',
        data: userObj
      }).then(function (res) {
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
  };

  // search the current searchText for a matching list of users
  function querySearch (query) {
    var results = query ? self.users.filter( createFilterFor(query) ) : self.states;
    var deferred = $q.defer();
    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
    return deferred.promise;
  };

  // http request to server... will return all non-friended users
  function getUsers () {
    var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/myUsers'
      }).then(function (res) {
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
  };

  // creates a filter function for a query string
  function createFilterFor (query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(user) {
      //Create lowercase versions of all searcheable data
      var firstName = angular.lowercase(user.firstName);
      var lastName = angular.lowercase(user.lastName);
      var email = angular.lowercase(user.email);
      var userName = angular.lowercase(user.userName);

      // return an array of objects that include the query
      return (firstName.includes(lowercaseQuery) || 
              lastName.includes(lowercaseQuery) ||
              email.includes(lowercaseQuery) ||
              userName.includes(lowercaseQuery));
    };
  };
};

