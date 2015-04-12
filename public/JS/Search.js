var config = require('./config.json');
var mongo = require('./Mongo.js');

var search = exports = module.exports = {};

search.queryDB = function(result) {
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
	  console.log(data);
	});
};
