class TwitterInterface
  constructor: () ->
    @api = 'https://api.twitter.com/1.1/'

    @keys =
      oauth : 'QB3YKlQOuN5vYnXz-K2EVV9nSBw'

    @.init()


  init: () ->

    OAuth.initialize @keys.oauth
    OAuth.popup 'twitter', (error, success) =>
      if success? and not error?
        @twitter = success
        @keys.token = @twitter.oauth_token
        @twitter.get('/me').done (res) =>
          console.log res
          console.log "Hello, " + res.name


