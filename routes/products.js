const express = require('express');
const router = express.Router();

const Product = require('../model/products');

/* GET products listing. */
router.get('/', function (req, res) {
	Product.find({ isActive: true })
		.populate('shop')
		.lean()
		.exec()
		.then((products) => {
			res.status(200).send(products);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res) {
	Product.find({})
		.populate('serviceProvider')
		.lean()
		.exec()
		.then((products) => {
			res.status(200).send(products);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/provider/:id', function (req, res) {
	const { id } = req.params;
	Product.find({ serviceProvider: id })
		.populate('serviceProvider')
		.lean()
		.exec()
		.then((products) => {
			res.status(200).send(products);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res) {
	Product.findOne({ _id: req.params.id })
		.populate('shop')
		.lean()
		.exec()
		.then((product) => {
			if (product) {
				return res.status(200).send({ isSuccess: true, product });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no product found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res) {
	const promoCodeDocument = new Product({ ...req.body });
	promoCodeDocument.save().then((product) => {
		delete product._doc.password;
		return res.status(200).send({ product: promoCodeDocument });
	}).catch((error) => {
		return res.status(error.status || 500).send(error);
	})
});

router.put('/:id', function (req, res) {
	Product.findOneAndUpdate({ _id: req.params.id }, req.body)
		.exec()
		.then(async (product) => {
			res.status(200).send({ isSuccess: true, message: 'product updated' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.delete('/:id', function (req, res) {
	Product.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then(async (product) => {
			product.isDeleted = true;
			product.isActive = false;
			await Product.findOneAndUpdate({ _id: product._id }, product);
			res.status(200).send({ isSuccess: true, message: 'product deleted' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

module.exports = router;
