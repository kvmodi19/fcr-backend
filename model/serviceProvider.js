const mongoose = require('mongoose');

const serviceProviderSchema = mongoose.Schema({
	eCardName: String,
	service: String,
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

module.exports = mongoose.model('ServiceProviders', serviceProviderSchema);