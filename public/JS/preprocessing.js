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
	if(coordinates !== undefined && coordinates !== ''){
		var state = cities.gps_lookup(coordinates[0], coordinates[1])['state'];
		var rating = sentiment(text);
		var results = {'text':text, 'state':state, 'sentiment':rating};
		this.push(results);
	}
	done();
}
