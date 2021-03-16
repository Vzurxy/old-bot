const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	userid: String,
	age: String
});

const model = mongoose.model('age', dataSchema);
module.exports = model;
