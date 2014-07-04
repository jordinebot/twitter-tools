twitterToolsApp = angular.module 'twitterToolsApp', ['yaru22.angular-timeago']

# Set an instance of TwitterClientInterface as Angular Service
twitterToolsApp.factory 'twitterInterface', () ->
  twitterInterface = new TwitterClientInterface()