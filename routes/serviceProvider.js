const express = require('express');
const router = express.Router();

const ServiceProvider = require('../model/serviceProvider');

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
	shopDocument.save().then((serviceProvider) => {
		delete serviceProvider._doc.password;
		return res.status(200).send({ serviceProvider: shopDocument });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.post('/search', function (req, res) {
	const { offset } = req.query;
	const {
		city,
		pinCode,
		country,
		text
	} = req.body;
	const limit = 5;
	const skip = Number(offset || 0) * limit;
	let findObject = {
		isDeleted: false, isActive: true
	};
	if (text) {
		findObject['eCardName'] = { $regex: text, '$options': 'i' };
	}
	findObject = { ...findObject, isActive: true };
	ServiceProvider.find({...findObject})
		.populate('user')
		.exec()
		.then(async (data) => {
			const total = await ServiceProvider.find({isDeleted: false, isActive: true});
			let filteredData = data;
			if (city || country || pinCode) {
				filteredData = data.filter((service) => {
					let matched = {
						city: false,
						country: false,
						pinCode: false
					}
					if (city) {
						matched.city = new RegExp(city, 'i').test(service.address.city);
					}
					if (pinCode) {
						matched.pinCode = new RegExp(pinCode, 'i').test(service.address.pinCode);
					}
					if (country) {
						matched.country = new RegExp(country, 'i').test(service.address.country);
					}
					return matched.city || matched.country || matched.pinCode;
				});
			}
			return res.status(200).send({ isSuccess: true, data: [...filteredData], total: total.length });
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
