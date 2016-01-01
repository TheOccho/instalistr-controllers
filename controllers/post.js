var mongoose = require('mongoose');
var Q = require('q');
var Post = require('../models/post');

module.exports.create = function(postData) {
	var defer = Q.defer();
	Post.findOne( { post_id: postData.post_id } ).exec(function(err, post) {
		if (err) return defer.reject(err);
		else if (!post) {
			post = new Post(postData);
			post.save(function(err) {
				if(err) return defer.reject(err);
				defer.resolve(post);
			});
		}
		else {
			defer.resolve(post);
		}
	});
	return defer.promise;
};

module.exports.get = function(_id) {
	var defer = Q.defer();
	Post.findOne( { _id: _id } ).exec(function(err, post) {
		if (err) return defer.reject({status: 500, message: err});
		else if (!post) return defer.reject({status: 404, message: 'post not found'});
		else defer.resolve(post);
	});
	return defer.promise;
};

module.exports.findByPostId = function(post_id) {
	var defer = Q.defer();
	Post.findOne( { post_id: post_id } ).exec(function(err, post) {
		if (err) return defer.reject(err);
		else if (!post) return defer.reject('post not found');
		else defer.resolve(post);
	});
	return defer.promise;
};

module.exports.remove = function(_id) {
	var defer = Q.defer();
	Post.findOne( { _id: _id } ).exec(function(err, post) {
		if (err) return defer.reject(err);
		if (!post.shared_with_other_lists) {
			post.remove(function(err) {
				if (err) {
					return defer.reject(err);
				}
				defer.resolve();
			});
		} else {
			defer.resolve();
		}
	});
	return defer.promise;
};

module.exports.destroy = function() {
	var defer = Q.defer();
	Post.remove({}).exec(function(err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve('post collection removed');
	});
	return defer.promise;
};
