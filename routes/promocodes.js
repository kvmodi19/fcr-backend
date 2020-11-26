const express = require('express');
const router = express.Router();

const PromoCodeController = require('../controller/promoCode');

/* GET promoCodes listing. */
router.get('/', function (req, res, next) {
	PromoCodeController.get()
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	PromoCodeController.getAll()
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/provider/:id', function (req, res, next) {
	const serviceId = req.params.id;
	PromoCodeController.getbyProviderId(serviceId)
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/user/:id', function (req, res, next) {
	const userId = req.params.id;
	PromoCodeController.getbyUserId(userId)
		.then((promoCodes) => {
			res.status(200).send(promoCodes);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});


router.get('/:id', function (req, res, next) {
	PromoCodeController.getById(req.params.id)
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
	PromoCodeController.add(req.body)
		.then((promoCode) => {
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
	PromoCodeController.delete(req.params.id)
		.then((data) => {
			return res.status(200).send(data);
		}).catch((error) => {
			return res.status(error.status || 500).send(error);
		});
});

module.exports = router;
