const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	userid: String,
	pedo: String
});

const model = mongoose.model('pedo', dataSchema);
module.exports = model;
