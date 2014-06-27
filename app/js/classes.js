var TwitterClientInterface;

TwitterClientInterface = (function() {
  function TwitterClientInterface() {
    this.api = 'api.php/?action=';
    this.keys = {
      oauth: ''
    };
    this.response = false;
  }

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
      this.ajax.post(this.api + 'user', {
        username: user
      }).success((function(_this) {
        return function(data, status, headers, config) {
          return _this.response = data;
        };
      })(this));
    }
    return this.response;
  };

  return TwitterClientInterface;

})();
