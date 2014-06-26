var TwitterInterface;

TwitterInterface = (function() {
  function TwitterInterface() {
    this.api = 'https://api.twitter.com/1.1/';
    this.keys = {
      oauth: 'QB3YKlQOuN5vYnXz-K2EVV9nSBw'
    };
    this.init();
  }

  TwitterInterface.prototype.init = function() {
    OAuth.initialize(this.keys.oauth);
    return OAuth.popup('twitter', (function(_this) {
      return function(error, success) {
        if ((success != null) && (error == null)) {
          _this.twitter = success;
          _this.keys.token = _this.twitter.oauth_token;
          return _this.twitter.get('/me').done(function(res) {
            console.log(res);
            return console.log("Hello, " + res.name);
          });
        }
      };
    })(this));
  };

  return TwitterInterface;

})();
