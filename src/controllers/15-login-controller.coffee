twitterToolsApp.controller 'loginController', ($scope, $http) ->

  # Set default encoding data mode for POST data transmission
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

  $scope.twitterSignIn = () ->
    console.log 'login in'