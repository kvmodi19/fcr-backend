const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
	name: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	description: String,
	address: {},
	isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Shops', shopSchema);