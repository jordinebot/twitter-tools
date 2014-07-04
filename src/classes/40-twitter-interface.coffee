class TwitterClientInterface
  constructor: () ->
    @api = 'api.php/?action='

    @keys =
      oauth_io : 'QB3YKlQOuN5vYnXz-K2EVV9nSBw'

    @twitter = null

  setScope: (scope) ->
    @scope = scope

  setTimer: (timeout) ->
    @timeout = timeout

  setAjax: (ajax) ->
    @ajax = ajax

  authenticate: (method) -> # https://dev.twitter.com/docs/auth/application-only-auth
    @method = method ?= 'app'

    if @ajax? and @method is 'app'
      # Application-only authentication
      @ajax.get @api + 'authenticate'
           .success (data, status, headers, config) =>
              console.log 'Application-only authentication success'

    else if @ajax? and @method is 'oauth'
      #OAuth authentication using http://oauth.io
      OAuth.initialize @keys.oauth_io
      OAuth.popup('twitter').done (result) =>
        @twitter = result
        result.me().done (data) =>
          @twitter.get("/1.1/account/verify_credentials.json").done (verify_credentials) =>
            console.log verify_credentials
    else
      false

  getUser: (user) ->
    if @ajax? and @method is 'app'
      @ajax.post @api + 'user', { username : user }
           .success (profile, status, headers, config) =>
              if profile.id?
                console.log profile
                @timeout () =>
                  @scope.$apply () =>
                    @scope.user.bio = profile.description
                    @scope.user.last_tweeted = profile.status.created_at if profile.status?
                    @scope.user.friends_count = profile.friends_count
                    @scope.user.followers_count = profile.followers_count
                    @scope.status.loaded.user = true
              else
                @timeout () =>
                  @scope.$apply () =>
                    @scope.status.loaded.user = false

              @scope.status.loading.user = false

              if profile.errors?
                console.log 'Error: ' + error.code + ' [' + error.message + ']' for error in profile.errors

    if @ajax? and @method is 'oauth' and @twitter?
      @twitter.get '/1.1/users/show.json?screen_name=' + user + '&user_id=' + user
              .done (profile) =>
                @timeout () =>
                  @scope.$apply () =>
                    @scope.user.bio = profile.description
                    @scope.user.last_tweeted = profile.status.created_at if profile.status?
                    @scope.user.friends_count = profile.friends_count
                    @scope.user.followers_count = profile.followers_count
                    @scope.status.loaded.user = true

    else
      console.log 'Cannot retrieve user...'


  getUserById: (id) ->
    if @ajax? and @method is 'app'
      @ajax.post @api + 'user_by_id', { username : id }
           .success (profile, status, headers, config) =>
              if profile.id?
                @timeout () =>
                  @scope.$apply () =>
                    @scope.status.progress++
                    @scope.user.followers.push {
                      screen_name : profile.screen_name
                      last_tweeted : profile.status.created_at if profile.status?
                    }

              if profile.errors?
                console.log 'Error: ' + error.code + ' [' + error.message + ']' for error in profile.errors

    if @ajax? and @method is 'oauth' and @twitter?
      @twitter.get '/1.1/users/show.json?user_id=' + id
              .done (profile) =>
                if profile.id?
                  @timeout () =>
                    @scope.$apply () =>
                      @scope.status.progress++
                      @scope.user.followers.push {
                        screen_name : profile.screen_name
                        last_tweeted : profile.status.created_at if profile.status?
                      }
                if profile.errors?
                  console.log 'Error: ' + error.code + ' [' + error.message + ']' for error in profile.errors

  getFollowers: (user, cursor) ->
    cursor ?= -1
    if @ajax? and @method is 'app'
      @scope.user.followers = [] if cursor is -1
      @ajax.post @api + 'followers', { username : user, cursor : cursor }
          .success (followers, status, headers, config) =>
            if followers.ids?.length > 0
              @.getUserById id for id in followers.ids

              if followers.next_cursor isnt 0
                @.getFollowers user, followers.next_cursor
              else
                if @scope.status.progress >= @scope.status.overall
                  @scope.status.loading.followers = false
                  @scope.status.loaded.followers = true

            if followers.errors?
              console.log 'Error: ' + error.code + ' [' + error.message + ']' for error in followers.errors

    if @ajax? and @method is 'oauth' and @twitter?
      @twitter.get '/1.1/followers/ids.json?screen_name=' + user + '&cursor=' + cursor
              .done (followers) =>
                @timeout () =>
                  @scope.$apply () =>
                    if followers.ids?.length > 0
                      @.getUserById id for id in followers.ids

                      if followers.next_cursor isnt 0
                        @.getFollowers user, followers.next_cursor
                      else
                        if @scope.status.progress >= @scope.status.overall
                          @scope.status.loading.followers = false
                          @scope.status.loaded.followers = true

                    if followers.errors?
                      console.log 'Error: ' + error.code + ' [' + error.message + ']' for error in followers.errors

