const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	title: String,
	description: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	read: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
});

module.exports = mongoose.model('Notification', notificationSchema);