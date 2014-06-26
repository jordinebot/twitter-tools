var tw, twitterToolsApp;

twitterToolsApp = angular.module('twitterToolsApp', []);

tw = new TwitterInterface();

twitterToolsApp.controller('mainController', function($scope) {
  $scope.msg = ['hola'];
  return true;
});
