var config = require('./config.json');
var mongo = require('./Mongo.js');

var search = exports = module.exports = {};

search.queryDB = function(result) {
	var params = { config: config
	             , url: config.mongo_url
	             , collection: config.mongo_collection
	             , query: { text : { $regex: result, $options: 'i' } }
	             , fields: {text : 1}
	             };

	mongo.find(params, function(err, items) {
	  console.log(items);
	});
};

search.queryDB('.*Good.*');