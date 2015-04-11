var Express = require('express');
var app = Express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Twit = require('twit');
var config = require('./config.json');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
var sentiment = require('sentiment'),
	cities = require('cities'),
	stream = require('stream');
 

  app.use(Express.static('public'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({secret: 'TFeels'}));
  app.use(passport.initialize());
  app.use(passport.session());

//Stream Transform
var writeTweets = new stream.Stream();
writeTweets.writable = true;
writeTweets.write = function(data) {return true};

var processTweet = function(data){
	var text = data['text'];
	var coordinates = data['coordinates'];
	if(coordinates !== null && coordinates !== ''){
		coordinates = coordinates['coordinates'];
		var state = cities.gps_lookup(parseFloat(coordinates[1]), parseFloat(coordinates[0]))['state'];
		var rating = sentiment(text)['score'];
		var results = {'text':text, 'state':state, 'sentiment':rating};
		return results;
	}
}
processTweets._transform = function(data, encoding, done){
	var text = data['text'];
	var coordinates = data['coordinates'];
	if(coordinates !== null && coordinates !== ''){
		coordinates = coordinates['coordinates'];
		var state = cities.gps_lookup(parseFloat(coordinates[1]), parseFloat(coordinates[0]))['state'];
		var rating = sentiment(text)['score'];
		var results = {'text':text, 'state':state, 'sentiment':rating};
		this.push(results);
	}
	done();
}

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
	var unitedStates = [ west, south, east, north ]

	var stream = T.stream('statuses/filter', { locations: unitedStates })

	stream.on('tweet', function (tweet) {
	  process.
	});
	stream.on('error', function (error) {
		throw error;
	});

	res.send(req.session);
});

app.listen(3000);
