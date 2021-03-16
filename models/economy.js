const Mongoose = require('mongoose');

const Economy = new Mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	money: {
		type: Number,
		default: 0
	},
	bank: {
		type: Number,
		default: 0
	},
	inventory: [String],
	dailySlowmode: {
		type: Number,
		default: Date.now()
	},
	weeklySlowmode: {
		type: Number,
		default: Date.now()
	},
	monthlySlowmode: {
		type: Number,
		default: Date.now()
	},
	workSlowmode: {
		type: Number,
		default: Date.now()
	},
	robSlowmode: {
		type: Number,
		default: Date.now()
	}
});

module.exports = Mongoose.model('economy', Economy);
