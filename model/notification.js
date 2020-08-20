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
	isDeleted: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Notification', notificationSchema);
