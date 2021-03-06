const express = require('express');
const router = express.Router();

const ServiceProvider = require('../model/serviceProvider');
const { getJwt } = require('../handler/utils');

const discardUserFields = '-password -lastLogin -sessionCount -createdAt -updatedAt -isActive -isDeleted';

/* GET serviceProvider listing. */
router.get('/', function (req, res, next) {
	ServiceProvider.find({ isActive: true })
		.populate('user', discardUserFields)
		.lean()
		.exec()
		.then((serviceProvider) => {
			res.status(200).send(serviceProvider);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	ServiceProvider.find({})
		.populate('user', '-password')
		.lean()
		.exec()
		.then((serviceProvider) => {
			res.status(200).send(serviceProvider);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res, next) {
	ServiceProvider.findOne({ _id: req.params.id })
		.populate('user', discardUserFields)
		.lean()
		.exec()
		.then((serviceProvider) => {
			if (serviceProvider) {
				return res.status(200).send({ isSuccess: true, serviceProvider });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no serviceProvider found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res, next) {
	const shopDocument = new ServiceProvider({ ...req.body });
	shopDocument.save().then(async (serviceProvider) => {
		delete serviceProvider._doc.password;
		const user = req.user;
		const tokenObj = {
			email: user.email,
			shopOwner: true,
			hasShop: true,
			_id: user._id,
			name: user.name,
			serviceId: serviceProvider._id
		};

		const token = await getJwt(tokenObj);

		return res.status(200).send({ token });
		// return res.status(200).send({ serviceProvider: shopDocument });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.post('/search', function (req, res) {
	const { offset } = req.query;
	const limit = 5;
	const skip = Number(offset || 0) * limit;
	let findObject = {
		isDeleted: false,
		isActive: true,
		user: { $ne: req.user._id }
	};
	Object.keys(req.body).forEach((key) => {
		switch (key) {
			case 'text': {
				findObject = {
					...findObject,
					eCardName: { $regex: req.body[key], '$options': 'i' }
				}
				break;
			}
			default: {
				if (req.body[key]) {
					findObject = {
						...findObject,
						[`address.${key}`]: { $regex: req.body[key], '$options': 'i' }
					}
				}
			}
		}
	});
	ServiceProvider.find({ ...findObject })
		.populate('user')
		.limit(limit)
		.skip(skip)
		.exec()
		.then(async (data) => {
			const total = await ServiceProvider.find({ isDeleted: false, isActive: true }).count();
			return res.status(200).send({ isSuccess: true, data: [...data], total: total });
		})
		.catch((error) => {
			return res.status(500).send({ isSuccess: true, message: error.message });
		});
});

router.put('/:id', function (req, res, next) {
	return res.status(200).send({ isSuccess: true, message: 'under progress' });
});

router.delete('/:id', function (req, res, next) {
	ServiceProvider.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then(async (serviceProvider) => {
			serviceProvider.isDeleted = true;
			serviceProvider.isActive = false;
			await ServiceProvider.findOneAndUpdate({ _id: serviceProvider._id }, serviceProvider);
			res.status(200).send({ isSuccess: true, message: 'service provider detail deleted' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

module.exports = router;
