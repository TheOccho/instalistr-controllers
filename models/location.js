var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Location;

var locationSchema = new Schema({
	shared_with_other_posts: {type: Boolean, default: false},
	instagram_id: Number,
	foursquare_id: String,
	name: String,
	location: Object,
	categories: Object,
	contact: Object,
	url: String
});

locationSchema.pre('save', function (next) {
	var location = this;
	location.updated_at = Date.now();
	next();
});

module.exports = Location = mongoose.model('location', locationSchema);
