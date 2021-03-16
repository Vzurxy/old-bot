const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	userid: String,
	size: String
});

const model = mongoose.model('size', dataSchema);
module.exports = model;
