var twitterToolsApp;

twitterToolsApp = angular.module('twitterToolsApp', []);

twitterToolsApp.controller('mainController', function($scope, $http) {
  var twitterInterface;
  twitterInterface = new TwitterClientInterface();
  twitterInterface.setAjax($http);
  twitterInterface.authenticate();
  $scope.msg = ['hola'];
  return true;
});
