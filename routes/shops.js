const express = require('express');
const router = express.Router();

const Shops = require('../model/shops');

const discardUserFields = '-password -lastLogin -sessionCount -createdAt -updatedAt -isActive -isDeleted';

/* GET shops listing. */
router.get('/', function (req, res, next) {
	Shops.find({ isActive: true })
		.populate('user', discardUserFields)
		.lean()
		.exec()
		.then((shops) => {
			res.status(200).send(shops);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	Shops.find({})
		.populate('user', '-password')
		.lean()
		.exec()
		.then((shops) => {
			res.status(200).send(shops);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res, next) {
	Shops.findOne({ _id: req.params.id })
		.populate('user', discardUserFields)
		.lean()
		.exec()
		.then((shop) => {
			if (shop) {
				return res.status(200).send({ isSuccess: true, shop });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no shop found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res, next) {
	const shopDocument = new Shops({ ...req.body });
	shopDocument.save().then((shop) => {
		delete shop._doc.password;
		return res.status(200).send({ shop: shopDocument });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.post('/search', function (req, res) {
	const { offset } = req.query;
	const limit = 5;
	const skip = Number(offset || 0) * limit;
	let findObject = {};
	if (req.body.searchBy === 'any') {
		const regexObj = { $regex: req.body.text, '$options': 'i' };
		findObject = { $or: [ { address: regexObj }, { name: regexObj } ], isDeleted: false, isActive: true };
	} else {
		findObject = { address: { $regex: req.body.text }, isDeleted: false, isActive: true };
	}
	findObject = { ...findObject, isActive: true };
	Shops.aggregate([
		{
			$match: findObject,
		},
		{
			$lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'user'

			}
		},
		{ "$unwind": "$user" },
		{ "$limit": skip + limit },
		{ "$skip": skip }
	])
		.exec()
		.then(async (data) => {
			const total = await Shops.find({isDeleted: false, isActive: true});
			return res.status(200).send({ isSuccess: true, data, total: total.length });
		})
		.catch((error) => {
			return res.status(500).send({ isSuccess: true, message: error.message });
		});
});

router.put('/:id', function (req, res, next) {
	return res.status(200).send({ isSuccess: true, message: 'under progress' });
});

router.delete('/:id', function (req, res, next) {
	Shops.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then(async (shop) => {
			shop.isDeleted = true;
			shop.isActive = false;
			await Shops.findOneAndUpdate({ _id: shop._id }, shop);
			res.status(200).send({ isSuccess: true, message: 'Shop deleted' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

module.exports = router;
