twitterToolsApp.controller 'mainController', ($scope, $http, $timeout) ->

  # Set default encoding data mode for POST data transmission
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

  twitterInterface = new TwitterClientInterface()
  twitterInterface.setScope $scope
  twitterInterface.setTimer $timeout
  twitterInterface.setAjax $http

  twitterInterface.authenticate()

  $scope.user =
    name:           ''
    bio:            ''
    last_tweeted:   ''
    friends:        []
    followers:      []


  $scope.status =
    loading:
      user:       false
      followers:  false
    loaded:
      user:       false
      followers:  false
    progress : 0
    overall  : 100

  $scope.getUsername = () ->
    $scope.user.name

  $scope.getFollowers = () ->
    if not $scope.status.loading.followers
      $scope.status.loading.followers = true
      $scope.status.overall = $scope.user.followers_count
      twitterInterface.getFollowers $scope.user.name
    else
      console.log 'Followers info is already being fetched!'

  nameChanged = (newValue, oldValue, scope) ->
    $scope.status.loaded.user = false
    $scope.status.loading.user = true if newValue isnt ''
    twitterInterface.getUser newValue

  $scope.$watch $scope.getUsername, nameChanged