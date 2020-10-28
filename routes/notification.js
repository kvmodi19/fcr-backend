const express = require('express');
const router = express.Router();

const notificationController = require('../controller/notification');

/* GET notifications */
router.get('/', function (req, res, next) {
	notificationController.getAllNotificationByUserID(req.query['userID'])
		.then((notifications) => {
			res.status(200).send(notifications);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/count', function (req, res, next) {
	notificationController.getUserNotificationWithCount(req.user._id)
		.then((notifications) => {
			res.status(200).send(notifications);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:type(read|unread)/count', function (req, res, next) {
	notificationController.getUserNotificationCount(req.user._id, req.params.type)
		.then((notifications) => {
			res.status(200).send(notifications);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	notificationController.getAll()
		.then((notifications) => {
			res.status(200).send(notifications);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res, next) {
	notificationController.getbyId(req.params.id)
		.then((notification) => {
			if (notification) {
				return res.status(200).send({ isSuccess: true, notification });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no notification found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res, next) {
	notificationController.add({ ...req.body })
		.then((notification) => {
		return res.status(200).send({ isSuccess: true });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.put('/read', function (req, res, next) {
	notificationController.markAllRead(req.user._id)
		.then((notification) => {
		return res.status(200).send({ isSuccess: true });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.put('/visited/:id', function (req, res, next) {
	notificationController.makrdVisited(req.params.id)
		.then((notification) => {
		return res.status(200).send({ isSuccess: true });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.delete('/:id', function (req, res, next) {
	notificationController.delete(req.params.id)
		.then((data) => {
			return res.status(200).send(data);
		}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

module.exports = router;
