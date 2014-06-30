var twitterToolsApp;

twitterToolsApp = angular.module('twitterToolsApp', []);

twitterToolsApp.controller('mainController', function($scope, $http) {
  var nameChanged, twitterInterface;
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  twitterInterface = new TwitterClientInterface();
  twitterInterface.setAjax($http);
  twitterInterface.authenticate();
  $scope.user = {
    name: 'jordinebot',
    bio: ''
  };
  $scope.getUsername = function() {
    return $scope.user.name;
  };
  nameChanged = function(newValue, oldValue, scope) {
    var user;
    return user = twitterInterface.getUser(newValue);
  };
  return $scope.$watch($scope.getUsername, nameChanged);
});
