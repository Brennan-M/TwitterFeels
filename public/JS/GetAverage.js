var	_ = require('lodash');

exports.mapAverages = function(data){
	return _.map(data, function(elem){
		var sum = _.reduce(elem.nums, function(sum, n){
			return sum + n;
		});
		return [elem.state, sum/elem.nums.length]
	});
}

var d = [{'state': 'CO', 'nums':[1,2,3,4,5,6,7,8]}];
console.log(mapAverages(d));