twitterToolsApp.controller 'mainController', ($scope, $http, $timeout) ->

  # Set default encoding data mode for POST data transmission
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  twitterInterface = new TwitterClientInterface()
  twitterInterface.setScope $scope
  twitterInterface.setTimer $timeout
  twitterInterface.setAjax $http

  twitterInterface.authenticate()

  $scope.user =
    name   : ''
    bio    : ''
    last_tweeted : ''


  $scope.status =
    loading : false
    loaded  : false

  $scope.getUsername = () ->
    $scope.user.name

  nameChanged = (newValue, oldValue, scope) ->
    $scope.status.loaded = false
    $scope.status.loading = true if newValue isnt ''
    twitterInterface.getUser newValue

  $scope.$watch $scope.getUsername, nameChanged