var TwitterClientInterface;

TwitterClientInterface = (function() {
  function TwitterClientInterface() {
    this.api = 'api.php/?action=';
    this.keys = {
      oauth_io: 'QB3YKlQOuN5vYnXz-K2EVV9nSBw'
    };
    this.twitter = null;
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

  TwitterClientInterface.prototype.authenticate = function(method) {
    this.method = method != null ? method : method = 'app';
    if ((this.ajax != null) && this.method === 'app') {
      return this.ajax.get(this.api + 'authenticate').success((function(_this) {
        return function(data, status, headers, config) {
          return console.log('Application-only authentication success');
        };
      })(this));
    } else if ((this.ajax != null) && this.method === 'oauth') {
      OAuth.initialize(this.keys.oauth_io);
      return OAuth.popup('twitter').done((function(_this) {
        return function(result) {
          _this.twitter = result;
          return result.me().done(function(data) {
            return _this.twitter.get("/1.1/account/verify_credentials.json").done(function(verify_credentials) {
              return console.log(verify_credentials);
            });
          });
        };
      })(this));
    } else {
      return false;
    }
  };

  TwitterClientInterface.prototype.getUser = function(user) {
    if ((this.ajax != null) && this.method === 'app') {
      this.ajax.post(this.api + 'user', {
        username: user
      }).success((function(_this) {
        return function(profile, status, headers, config) {
          var error, _i, _len, _ref, _results;
          if (profile.id != null) {
            console.log(profile);
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                _this.scope.user.bio = profile.description;
                if (profile.status != null) {
                  _this.scope.user.last_tweeted = profile.status.created_at;
                }
                _this.scope.user.friends_count = profile.friends_count;
                _this.scope.user.followers_count = profile.followers_count;
                return _this.scope.status.loaded.user = true;
              });
            });
          } else {
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                return _this.scope.status.loaded.user = false;
              });
            });
          }
          _this.scope.status.loading.user = false;
          if (profile.errors != null) {
            _ref = profile.errors;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
            }
            return _results;
          }
        };
      })(this));
    }
    if ((this.ajax != null) && this.method === 'oauth' && (this.twitter != null)) {
      return this.twitter.get('/1.1/users/show.json?screen_name=' + user + '&user_id=' + user).done((function(_this) {
        return function(profile) {
          return _this.timeout(function() {
            return _this.scope.$apply(function() {
              _this.scope.user.bio = profile.description;
              if (profile.status != null) {
                _this.scope.user.last_tweeted = profile.status.created_at;
              }
              _this.scope.user.friends_count = profile.friends_count;
              _this.scope.user.followers_count = profile.followers_count;
              return _this.scope.status.loaded.user = true;
            });
          });
        };
      })(this));
    } else {
      return console.log('Cannot retrieve user...');
    }
  };

  TwitterClientInterface.prototype.getUserById = function(id, pile) {
    if ((this.ajax != null) && this.method === 'app') {
      this.ajax.post(this.api + 'user_by_id', {
        username: id
      }).success((function(_this) {
        return function(profile, status, headers, config) {
          var error, _i, _len, _ref, _results;
          if (profile.id != null) {
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                _this.scope.status.progress++;
                return pile.push({
                  screen_name: profile.screen_name,
                  last_tweeted: profile.status != null ? profile.status.created_at : 0
                });
              });
            });
          }
          if (profile.errors != null) {
            _ref = profile.errors;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
            }
            return _results;
          }
        };
      })(this));
    }
    if ((this.ajax != null) && this.method === 'oauth' && (this.twitter != null)) {
      return this.twitter.get('/1.1/users/show.json?user_id=' + id).done((function(_this) {
        return function(profile) {
          var error, _i, _len, _ref, _results;
          if (profile.id != null) {
            _this.timeout(function() {
              return _this.scope.$apply(function() {
                _this.scope.status.progress++;
                return pile.push({
                  screen_name: profile.screen_name,
                  last_tweeted: profile.status != null ? profile.status.created_at : 0
                });
              });
            });
          }
          if (profile.errors != null) {
            _ref = profile.errors;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
            }
            return _results;
          }
        };
      })(this));
    }
  };

  TwitterClientInterface.prototype.getFriends = function(user, cursor) {
    if (cursor == null) {
      cursor = -1;
    }
    if ((this.ajax != null) && this.method === 'app') {
      if (cursor === -1) {
        this.scope.user.friends = [];
      }
      this.ajax.post(this.api + 'friends', {
        username: user,
        cursor: cursor
      }).success((function(_this) {
        return function(friends, status, headers, config) {
          var error, id, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
          if (((_ref = friends.ids) != null ? _ref.length : void 0) > 0) {
            _ref1 = friends.ids;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              id = _ref1[_i];
              _this.getUserById(id, _this.scope.user.friends);
            }
            if (friends.next_cursor !== 0) {
              _this.getFriends(user, friends.next_cursor);
            } else {
              if (_this.scope.status.progress >= _this.scope.status.overall) {
                _this.scope.status.loading.friends = false;
                _this.scope.status.loaded.friends = true;
              }
            }
          }
          if (friends.errors != null) {
            _ref2 = friends.errors;
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              error = _ref2[_j];
              _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
            }
            return _results;
          }
        };
      })(this));
    }
    if ((this.ajax != null) && this.method === 'oauth' && (this.twitter != null)) {
      return this.twitter.get('/1.1/friends/ids.json?screen_name=' + user + '&cursor=' + cursor).done((function(_this) {
        return function(friends) {
          return _this.timeout(function() {
            return _this.scope.$apply(function() {
              var error, id, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
              if (((_ref = friends.ids) != null ? _ref.length : void 0) > 0) {
                _ref1 = friends.ids;
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  id = _ref1[_i];
                  _this.getUserById(id, _this.scope.user.friends);
                }
                if (friends.next_cursor !== 0) {
                  _this.getFriends(user, friends.next_cursor);
                } else {
                  if (_this.scope.status.progress >= _this.scope.status.overall) {
                    _this.scope.status.loading.friends = false;
                    _this.scope.status.loaded.friends = true;
                  }
                }
              }
              if (friends.errors != null) {
                _ref2 = friends.errors;
                _results = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  error = _ref2[_j];
                  _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
                }
                return _results;
              }
            });
          });
        };
      })(this));
    }
  };

  TwitterClientInterface.prototype.getFollowers = function(user, cursor) {
    if (cursor == null) {
      cursor = -1;
    }
    if ((this.ajax != null) && this.method === 'app') {
      if (cursor === -1) {
        this.scope.user.followers = [];
      }
      this.ajax.post(this.api + 'followers', {
        username: user,
        cursor: cursor
      }).success((function(_this) {
        return function(followers, status, headers, config) {
          var error, id, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
          if (((_ref = followers.ids) != null ? _ref.length : void 0) > 0) {
            _ref1 = followers.ids;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              id = _ref1[_i];
              _this.getUserById(id, _this.scope.user.followers);
            }
            if (followers.next_cursor !== 0) {
              _this.getFollowers(user, followers.next_cursor);
            } else {
              if (_this.scope.status.progress >= _this.scope.status.overall) {
                _this.scope.status.loading.followers = false;
                _this.scope.status.loaded.followers = true;
              }
            }
          }
          if (followers.errors != null) {
            _ref2 = followers.errors;
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              error = _ref2[_j];
              _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
            }
            return _results;
          }
        };
      })(this));
    }
    if ((this.ajax != null) && this.method === 'oauth' && (this.twitter != null)) {
      return this.twitter.get('/1.1/followers/ids.json?screen_name=' + user + '&cursor=' + cursor).done((function(_this) {
        return function(followers) {
          return _this.timeout(function() {
            return _this.scope.$apply(function() {
              var error, id, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
              if (((_ref = followers.ids) != null ? _ref.length : void 0) > 0) {
                _ref1 = followers.ids;
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  id = _ref1[_i];
                  _this.getUserById(id, _this.scope.user.followers);
                }
                if (followers.next_cursor !== 0) {
                  _this.getFollowers(user, followers.next_cursor);
                } else {
                  if (_this.scope.status.progress >= _this.scope.status.overall) {
                    _this.scope.status.loading.followers = false;
                    _this.scope.status.loaded.followers = true;
                  }
                }
              }
              if (followers.errors != null) {
                _ref2 = followers.errors;
                _results = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  error = _ref2[_j];
                  _results.push(console.log('Error: ' + error.code + ' [' + error.message + ']'));
                }
                return _results;
              }
            });
          });
        };
      })(this));
    }
  };

  return TwitterClientInterface;

})();
