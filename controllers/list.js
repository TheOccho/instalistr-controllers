var mongoose = require('mongoose');
var Q = require('q');
var List = require('../models/list');

module.exports.getPosts = function(username, listname) {
  var defer = Q.defer();
  List.findOne( { username: username, name: listname } ).deepPopulate('posts.post.location').exec(function(err, list) {
    if (err) {
      return defer.reject({status: 500, message: err});
    } else if (!list) {
      return defer.reject({status: 404, message: 'list not found'});
    } else {
      // Sort by most recent
      list.posts.sort(function(a, b) {
        return new Date(b.post.post_created_time * 1000).getTime() - new Date(a.post.post_created_time * 1000).getTime();
      });
      defer.resolve(list.posts);
    }
  });
  return defer.promise;
};

module.exports.create = function(listData) {
	var defer = Q.defer();
	List.findOne( { username: listData.username, name: listData.name } ).exec(function(err, list) {
		if (err) { 
      return defer.reject(err);
    } else if (!list) {
			list = new List(listData);
			list.save(function(err) {
				if (err) {
          return defer.reject(err);
        }
				defer.resolve(list);
			});
		} else {
			defer.resolve(list);
		}
	});
	return defer.promise;
};

module.exports.remove = function(username, listname) {
	var defer = Q.defer();
	List.remove( { username: username, name: listname } ).exec(function (err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve(name + ' list was successfully removed for ' + username);
	});
	return defer.promise;
};

module.exports.removePost = function(username, listname, post_id) {
  var defer = Q.defer();
  List.findOne( { username: username, name: listname } ).exec(function(err, list) {
    if (err) {
      return defer.reject(err);
    } else {
      // Remove post from list
      var postIndex;
      for (var i=0,j=list.posts.length;i<j;i++) {
        if (list.posts[i].post.equals(post_id)) {
          postIndex = i;
          break;
        }
      }
      list.posts.splice(i, 1);
      list.save(function(err) {
        if (err) return defer.reject(err);
        defer.resolve(post_id);
      });
    }
  });
  return defer.promise;
};

module.exports.destroy = function() {
	var defer = Q.defer();
	List.remove({}).exec(function(err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve('list collection removed');
	});
	return defer.promise;
};
