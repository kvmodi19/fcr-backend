const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	title: String,
	description: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	for: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	type: {
		type: String,
		enum: ['message', 'visit']
	},
	visited: {
		type: Boolean,
		default: false
	},
	read: {
		type: Boolean,
		default: false
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

module.exports = mongoose.model('Notification', notificationSchema);
