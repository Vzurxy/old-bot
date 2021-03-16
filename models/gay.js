const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	userid: String,
	gay: String
});

const model = mongoose.model('gay', dataSchema);
module.exports = model;
