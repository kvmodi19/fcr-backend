const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const user = new Users(req.body);
		req.body._id = user._id;
		const folderName = user._id.toString();
		if (!fs.existsSync(`uploads/${folderName}`)) {
			fs.mkdirSync(`uploads/${folderName}`, { recursive: true });
		}
		cb(null, `uploads/${folderName}`)
	},
	filename: function (req, file, cb) {
		const fileExtension = file.mimetype.split('image/').pop();
		cb(null, `avatar.${fileExtension}`);
	}
});
const upload = multer({ storage });

const Users = require('../model/users');
const Shops = require('../model/shops');
const { BadRequestHandler, ResourceExistsRequestHandler } = require('../handler/request-handler');
/* GET users listing. */
router.get('/', function (req, res, next) {
	Users.find({ isActive: true })
		.select('cardName cardAddress address name mobile profession email')
		.lean()
		.exec()
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/all', function (req, res, next) {
	Users.find({})
		.select('-password')
		.lean()
		.exec()
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.get('/:id', function (req, res, next) {
	Users.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then((user) => {
			if (user) {
				return res.status(200).send({ isSuccess: true, user });
			} else {
				return res.status(404).send({ isSuccess: false, message: 'no user found' })
			}
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

router.post('/', function (req, res, next) {
	return register(req, res);
});

router.post('/register', upload.single('avatar'), function (req, res, next) {
	return register(req, res);
});

router.post('/search', function (req, res) {
	Users.find({ cardAddress: { $regex: req.body.country } })
		.select('-password')
		.lean()
		.exec()
		.then((data) => {
			return res.status(200).send({ isSuccess: true, data });
		})
		.catch((error) => {
			return res.status(500).send({ isSuccess: true, message: error.message });
		});
});

router.put('/:id', function (req, res, next) {
	return res.status(200).send({ isSuccess: true, message: 'under progress' });
});

router.delete('/:id', function (req, res, next) {
	Users.findOne({ _id: req.params.id })
		.lean()
		.exec()
		.then(async (user) => {
			user.isDeleted = true;
			user.isActive = false;
			await Users.findOneAndUpdate({ _id: user._id }, user);
			res.status(200).send({ isSuccess: true, message: 'user deleted' });
		})
		.catch((error) => {
			res.status(error.status || 500).send(error);
		})
});

const register = async (req, res) => {
	try {
		if (req.file && req.file.path) {
			req.body.profile = req.file.path;
		}
		const userDocument = new Users({ ...req.body });
		userDocument.save()
			.then((user) => {
				delete user._doc.password;
				return res.status(200).send({ user: userDocument });
			})
			.catch(async (error) => {
				debugger
				if (req.file) {
					if (fs.existsSync(req.file.destination)) {
						fs.readdirSync(req.file.destination).forEach(function (file) {
							const curPath = req.file.destination + "/" + file;
							if (fs.lstatSync(curPath).isDirectory()) { // recurse
								deleteFolderRecursive(curPath);
							} else { // delete file
								fs.unlinkSync(curPath);
							}
						});
						fs.rmdirSync(req.file.destination);
					}
				}
				if (error) {
					if (error.name === 'MongoError' && error.code === 11000) {
						if (error.message.includes('email')) {
							return ResourceExistsRequestHandler(req, res, { message: 'Email Already Registered.' });
						}
						if (error.message.includes('mobile')) {
							return ResourceExistsRequestHandler(req, res, { message: 'Mobile number Already Registered.' });
						}
					}
					if (error.name === 'ValidationError') {
						if (error.errors.email) {
							return BadRequestHandler(req, res, error.errors.email);
						}
						if (error.errors.mobile) {
							return BadRequestHandler(req, res, error.errors.mobile);
						}
					}
					return BadRequestHandler(req, res, error);
				}
			});
	} catch (error) {
		return BadRequestHandler(req, res, error);
	}
};

const login = async (req, res) => {
	if (!req.body.email) {
		res.status(500).send({ message: 'Email is required' });
	}
	if (!req.body.password) {
		res.status(500).send({ message: 'password is required' });
	}
	Users.findOne({ email: req.body.email })
		.lean()
		.then(async (user) => {
			if (user) {
				const passwordMatched = Users.checkPassword(req.body.password, user.password);
				if (passwordMatched) {
					if (user.isActive) {
						user.sessionCount++;
						await Users.findOneAndUpdate({ _id: user._id }, user);
					}
					const shopOwner = user.profession === 2;
					let hasShop = false;
					if (shopOwner) {
						const shops = await Shops.find({user: user._id});
						hasShop = !!shops.length;
					}

					const tokenObj = {
						email: user.email,
						shopOwner,
						hasShop,
						_id: user._id,
						name: user.name
					}
					const jwtKey = 'jwtKey';
					const jwtExpirySeconds = 24 * 1 * 60; // (hour * minute * second)
					const token = jwt.sign({ ...tokenObj }, jwtKey, {
						algorithm: "HS256",
						expiresIn: jwtExpirySeconds,
					});
					res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
					return res.status(200).send({ token },);
				} else {
					return res.status(400).send({ isSuccess: false, message: 'password does not matched' });
				}
			} else {
				return res.status(404).send({ isSuccess: false, message: 'User Doesn\'t Exists.. ' });
			}
		})
		.catch((error) => {
			return res.status(500).send({ error });
		});
};

module.exports = {
	router,
	register,
	login
};
