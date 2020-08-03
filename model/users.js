const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');

const saltRounds = 10;

const userSchema = mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true,
		required: [ true, 'User email address is required' ]
	},
	uniqueId: {
		type: String,
		default: uniqid()
	},
	address: String,
	age: Number,
	gender: {
		type: String,
		enum: [ 'male', 'female' ]
	},
	mobile: {
		type: Number,
		unique: true,
		required: [ true, 'Mobile number required' ],
	},
	password: {
		type: String,
		validate: {
			validator: function (v) {
				return /[a-zA-z0-9]{6,}/.test(v);
			},
			message: props => `${props.value} is not a valid password!`
		},
		required: true
	},
	profession: {
		type: Number,
		enum: [ 1, 2 ]
	},
	cardName: String,
	cardAddress: String,
	profile: String,
	dob: Date,
	lastLogin: [
		{
			ip: String,
			time: {
				type: Date,
				default: new Date()
			}
		}
	],
	sessionCount: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
});

/**
 * We can use something like this to secure store passwords
 * and validations after CES using Bcrypt:
 */
userSchema.pre('save', async function (next) {

	const salt = await bcrypt.genSaltSync(saltRounds);
	this.password = await bcrypt.hashSync(this.password, salt);

	const errors = await this.validate();

	if (errors) {
		throw Error(errors);
	} else {
		return next();
	}

});

userSchema.statics.checkPassword = (password, hash) => {
	return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model('Users', userSchema);