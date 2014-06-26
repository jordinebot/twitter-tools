class TwitterClientInterface
  constructor: () ->
    @api = 'api.php/?action='

    @keys =
      oauth : ''

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





