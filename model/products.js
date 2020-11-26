const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: String,
	serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProviders' },
	description: String,
	price: String,
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

module.exports = mongoose.model('Products', productSchema);