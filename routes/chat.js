const express = require('express');
const router = express.Router();

const controller = require('../controller/chat');

const { BadRequestHandler, InternalServerErrorHandler } = require('../handler/request-handler');

router.get('/list/:userId', async function (req, res, next) {
	try {
		const {userId} = req.params;
		const data = await controller.getUserChatList(userId);
		return res.status(200).send(data);
	} catch(error) {
		return InternalServerErrorHandler(re, res, error);
	}
});

router.get('/:from/:to', async function (req, res, next) {
	try {
		const {from, to} = req.params;
		const data = await controller.getChatRoomData(from, to);
		return res.status(200).send(data);
	} catch(error) {
		return InternalServerErrorHandler(re, res, error);
	}
});

module.exports = router;
