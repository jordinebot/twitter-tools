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
    last_tweeted: '',
    friends: [],
    followers: []
  };
  $scope.status = {
    loading: {
      user: false,
      followers: false
    },
    loaded: {
      user: false,
      followers: false
    },
    progress: 0,
    overall: 100
  };
  $scope.getUsername = function() {
    return $scope.user.name;
  };
  $scope.getFollowers = function() {
    if (!$scope.status.loading.followers) {
      $scope.status.loading.followers = true;
      $scope.status.overall = $scope.user.followers_count;
      return twitterInterface.getFollowers($scope.user.name);
    } else {
      return console.log('Followers info is already being fetched!');
    }
  };
  nameChanged = function(newValue, oldValue, scope) {
    $scope.status.loaded.user = false;
    if (newValue !== '') {
      $scope.status.loading.user = true;
    }
    return twitterInterface.getUser(newValue);
  };
  return $scope.$watch($scope.getUsername, nameChanged);
});
