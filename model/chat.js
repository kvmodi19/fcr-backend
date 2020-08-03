const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	message: String,
	from: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	read: {
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

module.exports = mongoose.model('Chats', chatSchema);