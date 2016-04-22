angular.module('dashboard', ['ngMaterial'])
  .controller('dashboardController', dashboardController);

function dashboardController () {
  var self = this;
  // This populates with all non-friended users
  // self.users = getUsers();
  self.users = [{name:'Mark'}, {name:'Stuart'}, {name:'Phil'}, {name:'Dan'}, {name:'Nassir'}, {name:'Trevor'}]
  self.selectedUser = null;
  self.searchText = null;
  self.querySearch = querySearch;

  // search the current searchText for a matching list of users
  function querySearch (query) {};

  // http request to server... will return all non-friended users
  function getUsers () {};

  // creates a filter function for a query string
  function createFilterFor (query) {};
};

