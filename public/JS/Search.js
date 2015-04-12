var config = require('./config.json');
var mongo = require('./Mongo.js');
var app = require('./../../app.js');

var search = exports = module.exports = {};

search.queryDB = function(result, hollaback) {
	var params = { config: config
	             , url: config.mongo_url
	             , collection: config.mongo_collection
	             , sequence: [
	             	{ $match : { text : { $regex: result, $options: 'i' } } },
	             	{ $group :  {
	             			"_id" : "$state", 
	             			avgSentiment : { $avg : "$sentiment"},
	             			weightedSentiment : { $avg : { $multiply : ["$sentiment", "$sentiment", "$sentiment"] } },
	             			intensity : { $sum : 1 }
	             		}
	             	}
	               ]
	             };

	mongo.aggregate(params, function(err, data) {
        hollaback(err, data);
	});
};
// search.queryDB('.*loons.*', function(err,data){console.log(data)});