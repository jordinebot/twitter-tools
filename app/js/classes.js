var TwitterClientInterface;

TwitterClientInterface = (function() {
  function TwitterClientInterface() {
    this.api = 'api.php/?action=';
    this.keys = {
      oauth: ''
    };
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

  return TwitterClientInterface;

})();
