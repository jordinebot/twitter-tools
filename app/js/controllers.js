var twitterToolsApp;

twitterToolsApp = angular.module('twitterToolsApp', ['yaru22.angular-timeago']);

twitterToolsApp.controller('mainController', function($scope, $http, $timeout) {
  var nameChanged, twitterInterface;
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  twitterInterface = new TwitterClientInterface();
  twitterInterface.setScope($scope);
  twitterInterface.setTimer($timeout);
  twitterInterface.setAjax($http);
  twitterInterface.authenticate();
  $scope.user = {
    name: '',
    bio: '',
    last_tweeted: ''
  };
  $scope.status = {
    loading: false,
    loaded: false
  };
  $scope.getUsername = function() {
    return $scope.user.name;
  };
  nameChanged = function(newValue, oldValue, scope) {
    $scope.status.loaded = false;
    if (newValue !== '') {
      $scope.status.loading = true;
    }
    return twitterInterface.getUser(newValue);
  };
  return $scope.$watch($scope.getUsername, nameChanged);
});
