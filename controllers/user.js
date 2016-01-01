var mongoose = require('mongoose');
var Q = require('q');
var _ = require('lodash');
var User = require('../models/user');
var ListCtrl = require('../controllers/list');

module.exports.create = function(userData) {
	var defer = Q.defer();
	User.findOne( { username: userData.username } ).exec(function(err, user) {
		if (err) return defer.reject(err);
		else if(!user) {
			user = new User(userData);
			user.save(function(err) {
				if(err) return defer.reject(err);
				defer.resolve(user);
			});
		} else {
      // Update the access_token for this user (asynchronously)
      User.findByIdAndUpdate(user._id, { access_token: userData.access_token });
      
      // Return user
      defer.resolve(user);
		}
	});
	return defer.promise;
};

module.exports.getUser = function(username) {
  var defer = Q.defer();
  User.findOne( {username: username} ).exec(function(err, user) {
    if(err) return defer.reject({status: 500, message: err});
    else if(!user) return defer.reject({status: 404, message: 'user not found'});
    else {
      defer.resolve(user);
    }
  });
  return defer.promise;
};

module.exports.getLists = function(username) {
	var defer = Q.defer();
	User.findOne( { username: username } ).deepPopulate('lists.posts.post').exec(function(err, user) {
		if(err) return defer.reject({status: 500, message: err});
		else if(!user) return defer.reject({status: 404, message: 'user not found'});
		else {
      var lists = [], tmpObj;
      user.lists.forEach(function(list) {
        tmpObj = {};
        tmpObj.id = list._id;
        tmpObj.name = list.name;
        tmpObj.cover_photo = (list.posts.length > 0) ? list.posts[0].post.images.standard_resolution : null;
        tmpObj.numPosts = list.posts.length;
        tmpObj.updated_at = list.updated_at;
        lists.push(tmpObj);
      });

      // Sort by most recent
      lists.sort(function(a, b) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      
      defer.resolve(lists);
    }
	});
	return defer.promise;
};

module.exports.removeList = function(username, listname) {
  var defer = Q.defer();
  User.findOne( { username: username } ).exec(function(err, user) {
    ListCtrl.create({username: username, name: listname})
      .then(function(list) {
        // Remove list from user model
        var listIndex;
        for (var i=0,j=user.lists.length;i<j;i++) {
          if (user.lists[i].equals(list._id)) {
            listIndex = i;
            break;
          }
        }
        user.lists.splice(i, 1);
        user.save(function(err) {
          if (err) return defer.reject(err);
          defer.resolve(list);
        });
      });
  });
  return defer.promise;
};

module.exports.remove = function(username) {
	var defer = Q.defer();
	User.remove( { username: username } ).exec(function (err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve(username + ' was successfully removed');
	});
	return defer.promise;
};

module.exports.destroy = function() {
	var defer = Q.defer();
	User.remove({}).exec(function(err) {
		if (err) return defer.reject(err);
		// removed!
		defer.resolve('user collection removed');
	});
	return defer.promise;
};
