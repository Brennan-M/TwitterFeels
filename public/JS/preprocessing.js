var sentiment = require('sentiment'),
	cities = require('cities'),
	Transform = require('stream').Transform;

var getSentiment = function(text){
	return sentiment(text)
}

var getState = function(lat, lng){
	return cities.gps_lookup(lat, lng)['state'];
}

processTweets._transform = function(data, encoding, done){
	var text = data['text'];
	var coordinates = data['coordinates'];
	this.push(results);
	done();
}
