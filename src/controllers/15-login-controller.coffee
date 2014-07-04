twitterToolsApp.controller 'loginController', ($scope, $http, twitterInterface) ->

  # Set default encoding data mode for POST data transmission
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

  twitterInterface.setScope $scope
  twitterInterface.setAjax $http

  $scope.twitterSignIn = () ->
    console.log 'OAuth'
    twitterInterface.authenticate 'oauth'