var mongoose = require('mongoose');
var Q = require('q');
var Location = require('../models/location');

module.exports.create = function(locationData) {
	var defer = Q.defer();
	Location.findOne( { instagram_id: locationData.instagram_id } ).exec(function(err, location) {
		if(err) return defer.reject(err);
		else if(!location) {
			location = new Location(locationData);
			location.save(function(err) {
				if(err) return defer.reject(err);
				defer.resolve(location);
			});
		}
		else {
			defer.resolve(location);
		}
	});
	return defer.promise;
};

module.exports.findByLocationId = function(location_id) {
	var defer = Q.defer();
	Location.findOne( { instagram_id: location_id } ).exec(function(err, location) {
		if(err) return defer.reject(err);
		else if(!location) return defer.reject('location not found');
		else defer.resolve(location);
	});
	return defer.promise;
};

module.exports.remove = function(location_id) {
	var defer = Q.defer();
	Location.remove( { instagram_id: location_id } ).exec(function (err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve('Location id: ' + location_id + ' was successfully removed');
	});
	return defer.promise;
};

module.exports.destroy = function() {
	var defer = Q.defer();
	Location.remove({}).exec(function(err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve('location collection removed');
	});
	return defer.promise;
};