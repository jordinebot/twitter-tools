var TwitterClientInterface;TwitterClientInterface=function(){function a(){this.api="api.php/?action=",this.keys={oauth_io:"QB3YKlQOuN5vYnXz-K2EVV9nSBw"},this.twitter=null}return a.prototype.setScope=function(a){return this.scope=a},a.prototype.setTimer=function(a){return this.timeout=a},a.prototype.setAjax=function(a){return this.ajax=a},a.prototype.authenticate=function(a){return this.method=null!=a?a:a="app",null!=this.ajax&&"app"===this.method?this.ajax.get(this.api+"authenticate").success(function(){return function(){return console.log("Application-only authentication success")}}(this)):null!=this.ajax&&"oauth"===this.method?(OAuth.initialize(this.keys.oauth_io),OAuth.popup("twitter").done(function(a){return function(b){return a.twitter=b,b.me().done(function(a){return console.log(a)})}}(this))):!1},a.prototype.getUser=function(a){return null!=this.ajax&&"app"===this.method&&this.ajax.post(this.api+"user",{username:a}).success(function(a){return function(b){var c,d,e,f,g;if(null!=b.id?(console.log(b),a.timeout(function(){return a.scope.$apply(function(){return a.scope.user.bio=b.description,null!=b.status&&(a.scope.user.last_tweeted=b.status.created_at),a.scope.user.friends_count=b.friends_count,a.scope.user.followers_count=b.followers_count,a.scope.status.loaded.user=!0})})):a.timeout(function(){return a.scope.$apply(function(){return a.scope.status.loaded.user=!1})}),a.scope.status.loading.user=!1,null!=b.errors){for(f=b.errors,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(console.log("Error: "+c.code+" ["+c.message+"]"));return g}}}(this)),null!=this.ajax&&"oauth"===this.method&&null!=this.twitter?this.twitter.me().done(function(a){return function(b){return a.timeout(function(){return a.scope.$apply(function(){return a.scope.user.bio=b.raw.description,null!=b.status&&(a.scope.user.last_tweeted=b.raw.status.created_at),a.scope.user.friends_count=b.raw.friends_count,a.scope.user.followers_count=b.raw.followers_count,a.scope.status.loaded.user=!0})})}}(this)):console.log("Cannot retrieve user...")},a.prototype.getUserById=function(a){return null!=this.ajax?this.ajax.post(this.api+"user_by_id",{username:a}).success(function(a){return function(b){var c,d,e,f,g;if(null!=b.id&&a.timeout(function(){return a.scope.$apply(function(){return a.scope.status.progress++,a.scope.user.followers.push({screen_name:b.screen_name,last_tweeted:null!=b.status?b.status.created_at:void 0})})}),null!=b.errors){for(f=b.errors,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(console.log("Error: "+c.code+" ["+c.message+"]"));return g}}}(this)):void 0},a.prototype.getFollowers=function(a,b){return null==b&&(b=-1),null!=this.ajax?(-1===b&&(this.scope.user.followers=[]),this.ajax.post(this.api+"followers",{username:a,cursor:b}).success(function(b){return function(c){var d,e,f,g,h,i,j,k,l,m;if((null!=(j=c.ids)?j.length:void 0)>0){for(k=c.ids,f=0,h=k.length;h>f;f++)e=k[f],b.getUserById(e);0!==c.next_cursor?b.getFollowers(a,c.next_cursor):b.scope.status.progress>=b.scope.status.overall&&(b.scope.status.loading.followers=!1,b.scope.status.loaded.followers=!0)}if(null!=c.errors){for(l=c.errors,m=[],g=0,i=l.length;i>g;g++)d=l[g],m.push(console.log("Error: "+d.code+" ["+d.message+"]"));return m}}}(this))):void 0},a}();var twitterInterface,twitterToolsApp;twitterInterface=new TwitterClientInterface,twitterToolsApp=angular.module("twitterToolsApp",["yaru22.angular-timeago"]),twitterToolsApp.controller("loginController",function(a,b){return b.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",twitterInterface=new TwitterClientInterface,twitterInterface.setScope(a),twitterInterface.setAjax(b),a.twitterSignIn=function(){return console.log("OAuth"),twitterInterface.authenticate("oauth")}}),twitterToolsApp.controller("mainController",function(a,b,c){var d;return b.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",twitterInterface=new TwitterClientInterface,twitterInterface.setScope(a),twitterInterface.setTimer(c),twitterInterface.setAjax(b),a.user={name:"",bio:"",last_tweeted:"",friends:[],followers:[]},a.status={loading:{user:!1,followers:!1},loaded:{user:!1,followers:!1},progress:0,overall:100},a.getUsername=function(){return a.user.name},a.getFollowers=function(){return a.status.loading.followers?console.log("Followers info is already being fetched!"):(a.status.loading.followers=!0,a.status.overall=a.user.followers_count,twitterInterface.getFollowers(a.user.name))},d=function(b){return a.status.loaded.user=!1,""!==b&&(a.status.loading.user=!0),twitterInterface.getUser(b)},a.$watch(a.getUsername,d)});