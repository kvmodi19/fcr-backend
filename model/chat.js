const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	message: String,
	from: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	createdAt: {
		type: Date,
		default: new Date()
	}
});

module.exports = mongoose.model('Chats', chatSchema);