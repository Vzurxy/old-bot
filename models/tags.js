const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	tag: String,
	guild: String,
	content: String
});

const model = mongoose.model('tags', dataSchema);
module.exports = model;
