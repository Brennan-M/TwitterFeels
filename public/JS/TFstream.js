var Express = require('express');
var app = Express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Twit = require('twit');
var config = require('./config.json');
var passport = require('passport');
var mongo = require('./Mongo.js');
var TwitterStrategy = require('passport-twitter').Strategy;
var sentiment = require('sentiment');
var cities = require('cities');
 
var trending = exports = module.exports = {};

 var TFstream = exports = module.exports = {};

  app.use(Express.static('public'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({secret: 'TFeels'}));
  app.use(passport.initialize());
  app.use(passport.session());

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

var processTrending = function(data) {
	var text = data['text'];
	var retweets = data['retweet_count'];
	var favorites = data['favorite_count'];
	var coordinates = data['coordinates'];
	var feels = sentiment(data['text']);
	var results = {'text':text, 'retweets':retweets, 'favorites':favorites, 'sentiment':feels};
	return results;

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
	var unitedStates = [ west, south, east, north ]
	var Alaska = [ '130', '51.2', '172', '71.6']
	var Hawaii = [ '154.5', '18.5', '178', '28.3']

	var stream = T.stream('statuses/filter', { locations: [unitedStates, Alaska, Hawaii] })

	stream.on('tweet', function (tweet) {
	  var insertParams = { url: config.mongo_url
	                     , collection: config.mongo_collection
	  };
	  insertParams.docs = processTweet(tweet);
	  if (insertParams.docs !== undefined) {
	    mongo.insertDocs(insertParams, function(err){
	  	  if (err) {
	  	    console.log(err);
	  	  }
	    });
	  };

	});

	stream.on('error', function (error) {
		throw error;
	});

	res.send(req.session);
});

TFstream.getPopular = function(keyword, callback) {
	try{
	var T = new Twit({
	    consumer_key:         config.CONSUMER_KEY
	  , consumer_secret:      config.CONSUMER_SECRET
	  , access_token:         '3148921273-OtpTEtf2NdAbm9cIH7FsNhlXr9gxhsfs7YCDGor'
	  , access_token_secret:  'yUtgKo33u4SkGUlIuxJ86sTOh3ZUMCecPVDXtdIgyiUSq'
	});

	var west = '-124.3'
	var east = '-66.9'
	var south = '25.8'
	var north = '49.4'
	var unitedStates = [ west, south, east, north ]

	var trends = [];
	T.get('search/tweets', { q: keyword, result_type: 'popular', locations: unitedStates }, function(err, tweet, response) {
	  if(err){
	  	console.log(err);
	  }
	  for (i in tweet.statuses) {
	  	trends.push(processTrending(tweet.statuses[i]));
	  }
	  console.log(trends);
	  callback(err,trends);
	});	
	}
	catch(err){
		console.log(err);
	}
}

app.listen(3001);
