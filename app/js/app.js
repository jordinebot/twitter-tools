var TwitterInterface;TwitterInterface=function(){function a(){this.api="https://api.twitter.com/1.1/",this.keys={oauth:"QB3YKlQOuN5vYnXz-K2EVV9nSBw"},this.init()}return a.prototype.init=function(){return OAuth.initialize(this.keys.oauth),OAuth.popup("twitter",function(a){return function(b,c){return null!=c&&null==b?(a.twitter=c,a.keys.token=a.twitter.oauth_token,a.twitter.get("/me").done(function(a){return console.log(a),console.log("Hello, "+a.name)})):void 0}}(this))},a}();var tw,twitterToolsApp;twitterToolsApp=angular.module("twitterToolsApp",[]),tw=new TwitterInterface,twitterToolsApp.controller("mainController",function(a){return a.msg=["hola"],!0});