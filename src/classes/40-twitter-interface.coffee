class TwitterClientInterface
  constructor: () ->
    @api = 'api.php/?action='

    @keys =
      oauth : ''

    @response = false

  setScope: (scope) ->
    @scope = scope

  setTimer: (timeout) ->
    @timeout = timeout

  setAjax: (ajax) ->
    @ajax = ajax

  authenticate: () -> # https://dev.twitter.com/docs/auth/application-only-auth
    if @ajax?
      # Application-only authentication
      @ajax.get @api + 'authenticate'
           .success (data, status, headers, config) =>
              @keys.token = data.token
    else
      false

  getUser: (user) ->
    if @ajax?
      @ajax.post @api + 'user', { username : user }
           .success (profile, status, headers, config) =>
              if profile.id?
                console.log profile
                @timeout () =>
                  @scope.$apply () =>
                    @scope.user.bio = profile.description
                    @scope.user.last_tweeted = profile.status.created_at if profile.status?
                    @scope.user.friends = profile.friends_count
                    @scope.user.followers = profile.followers_count
                    @scope.status.loaded = true
              else
                @timeout () =>
                  @scope.$apply () =>
                    @scope.status.loaded = false

              @scope.status.loading = false


