twitterToolsApp.controller 'mainController', ($scope, $http) ->

  twitterInterface = new TwitterClientInterface()
  twitterInterface.setAjax $http
  twitterInterface.authenticate()

  $scope.msg = ['hola']
  true