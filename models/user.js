require('./list');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema = mongoose.Schema;
var User;

var userSchema = new Schema({
	created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  profile_id: Number,
  username: String,
  full_name: String,
  profile_picture: String,
  access_token: {type: String, default: null},
  lists: [{ type : Schema.Types.ObjectId, ref: 'list' }]
});

userSchema.plugin(deepPopulate);

userSchema.pre('save', function (next) {
  var user = this;
  user.updated_at = Date.now();
  next();
});

module.exports = User = mongoose.model('user', userSchema);
