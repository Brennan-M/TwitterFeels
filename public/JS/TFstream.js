var Express = require('express');
var app = Express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Twit = require('twit');
var config = require('./config.json');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
 

  app.use(Express.static('public'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({secret: 'TFeels'}));
  app.use(passport.initialize());
  app.use(passport.session());



passport.use(new TwitterStrategy({
    consumerKey: config.CONSUMER_KEY,
    consumerSecret: config.CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(token, tokenSecret);
    var user = { token: token, tokenSecret: tokenSecret};
    done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

app.get('/amiauthed', function (req, res) {
	var T = new Twit({
	    consumer_key:         config.CONSUMER_KEY
	  , consumer_secret:      config.CONSUMER_SECRET
	  , access_token:         req.session.passport.user.token
	  , access_token_secret:  req.session.passport.user.tokenSecret
	});


	var west = '-124.3'
	var east = '-66.9'
	var south = '25.8'
	var north = '49.4'
	// TODO: What order does this location need to be in????
	var unitedStates = [ '-124.8', '24.4', '-66.9', '49.4' ]

	var stream = T.stream('statuses/filter', { locations: unitedStates })

	stream.on('tweet', function (tweet) {
	  console.log(tweet.coordinates);
	});
	stream.on('error', function (error) {
		throw error;
	});

	res.send(req.session);
});

app.listen(3000);
