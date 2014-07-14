var twitterToolsApp;

twitterToolsApp = angular.module('twitterToolsApp', ['yaru22.angular-timeago']);

twitterToolsApp.factory('twitterInterface', function() {
  var twitterInterface;
  return twitterInterface = new TwitterClientInterface();
});

twitterToolsApp.controller('loginController', function($scope, $http, twitterInterface) {
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  twitterInterface.setScope($scope);
  twitterInterface.setAjax($http);
  return $scope.twitterSignIn = function() {
    console.log('OAuth');
    return twitterInterface.authenticate('oauth');
  };
});

twitterToolsApp.controller('mainController', function($scope, $http, $timeout, twitterInterface) {
  var nameChanged;
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  twitterInterface.setScope($scope);
  twitterInterface.setTimer($timeout);
  twitterInterface.setAjax($http);
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
      friends: false,
      followers: false
    },
    loaded: {
      user: false,
      friends: false,
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
  $scope.getFriends = function() {
    if (!$scope.status.loading.friends) {
      $scope.status.loading.friends = true;
      $scope.status.overall = $scope.user.friends_count;
      return twitterInterface.getFriends($scope.user.name);
    } else {
      return console.log('Friends info is already being fetched!');
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
