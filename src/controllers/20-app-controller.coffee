twitterToolsApp.controller 'mainController', ($scope, $http) ->

  # Set default encoding data mode for POST data transmission
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  twitterInterface = new TwitterClientInterface()
  twitterInterface.setAjax $http
  twitterInterface.authenticate()

  $scope.user =
    name : 'jordinebot'
    bio  : ''

  $scope.getUsername = () ->
    $scope.user.name

  nameChanged = (newValue, oldValue, scope) ->
    user = twitterInterface.getUser newValue
    console.log user

  $scope.$watch $scope.getUsername, nameChanged