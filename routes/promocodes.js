const express = require('express');
const router = express.Router();

const PromoCodes = require('../model/promoCodes');

/* GET promoCodes listing. */
router.get('/', function (req, res, next) {
	PromoCodes.find({ isActive: true })
		.populate('shop')
		.lean()
		.exec()
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	PromoCodes.find({})
		.populate('shop')
		.lean()
		.exec()
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res, next) {
	PromoCodes.findOne({ _id: req.params.id })
		.populate('shop')
		.lean()
		.exec()
		.then((promoCode) => {
			if (promoCode) {
				return res.status(200).send({ isSuccess: true, promoCode });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no promoCode found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res, next) {
	const promoCodeDocument = new PromoCodes({ ...req.body });
	promoCodeDocument.save().then((promoCode) => {
		delete promoCode._doc.password;
		return res.status(200).send({ promoCode: promoCodeDocument });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.put('/:id', function (req, res, next) {
	return res.status(200).send({ isSuccess: true, message: 'under progress' });
});

router.delete('/:id', function (req, res, next) {
	PromoCodes.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then(async (promoCode) => {
			promoCode.isDeleted = true;
			promoCode.isActive = false;
			await PromoCodes.findOneAndUpdate({ _id: promoCode._id }, promoCode);
			res.status(200).send({ isSuccess: true, message: 'promoCode deleted' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

module.exports = router;
