require('./location');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post;

var postSchema = new Schema({
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	shared_with_other_lists: {type: Boolean, default: false},
	post_id: String,
	post_created_time: String,
	location: { type : Schema.Types.ObjectId, ref: 'location' },
	likes: Number,
	link: String,
	caption: String,
	type: String,
	images: {
		thumbnail: String,
		low_resolution: String,
		standard_resolution: String
	},
	videos: {
		low_resolution: String,
		standard_resolution: String
	},
	user: {
		username: String,
		profile_picture: String,
		id: String,
		full_name: String
	}
});

postSchema.pre('save', function (next) {
  var post = this;
  post.updated_at = Date.now();
  next();
});

module.exports = Post = mongoose.model('post', postSchema);
