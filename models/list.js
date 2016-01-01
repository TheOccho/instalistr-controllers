require('./post');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema = mongoose.Schema;
var List;

var listSchema = new Schema({
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	name: String,
	username: String,
	posts: [{tags: {type: Array, default: []}, post: { type : Schema.Types.ObjectId, ref: 'post' }}]
});

listSchema.plugin(deepPopulate);

listSchema.pre('save', function (next) {
	var list = this;
	list.updated_at = Date.now();
	next();
});

module.exports = List = mongoose.model('list', listSchema);
