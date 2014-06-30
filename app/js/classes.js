var TwitterClientInterface;

TwitterClientInterface = (function() {
  function TwitterClientInterface() {
    this.api = 'api.php/?action=';
    this.keys = {
      oauth: ''
    };
    this.response = false;
  }

  TwitterClientInterface.prototype.setScope = function(scope) {
    return this.scope = scope;
  };

  TwitterClientInterface.prototype.setTimer = function(timeout) {
    return this.timeout = timeout;
  };

  TwitterClientInterface.prototype.setAjax = function(ajax) {
    return this.ajax = ajax;
  };

  TwitterClientInterface.prototype.authenticate = function() {
    if (this.ajax != null) {
      return this.ajax.get(this.api + 'authenticate').success((function(_this) {
        return function(data, status, headers, config) {
          return _this.keys.token = data.token;
        };
      })(this));
    } else {
      return false;
    }
  };

  TwitterClientInterface.prototype.getUser = function(user) {
    if (this.ajax != null) {
      return this.ajax.post(this.api + 'user', {
        username: user
      }).success((function(_this) {
        return function(profile, status, headers, config) {
          if (profile.id != null) {
            console.log(profile);
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                _this.scope.user.bio = profile.description;
                if (profile.status != null) {
                  _this.scope.user.last_tweeted = profile.status.created_at;
                }
                _this.scope.user.friends = profile.friends_count;
                _this.scope.user.followers = profile.followers_count;
                return _this.scope.status.loaded = true;
              });
            });
          } else {
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                return _this.scope.status.loaded = false;
              });
            });
          }
          return _this.scope.status.loading = false;
        };
      })(this));
    }
  };

  return TwitterClientInterface;

})();
