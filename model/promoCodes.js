const mongoose = require('mongoose');

const promoCodeSchema = mongoose.Schema({
	name: String,
	shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shops' },
	description: String,
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

module.exports = mongoose.model('PromoCodes', promoCodeSchema);