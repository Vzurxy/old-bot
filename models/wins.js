const Mongoose = require('mongoose');

const Economy = new Mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	connectfour: {
		type: Number,
		default: 0
	},
	connectfourbot: {
		type: Number,
		default: 0
	}
});

module.exports = Mongoose.model('wins', Economy);
