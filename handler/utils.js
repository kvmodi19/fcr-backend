const { sign, verify } = require('jsonwebtoken');
const options = require('../config');
const jwtExpirySeconds = 365 * 24 * 60 * 1000;

const getJwt = (data, expires = jwtExpirySeconds) => new Promise((resolve, reject) => {
    sign(data, options.jwtSecret, { expiresIn: expires }, (err, token) => {
        if (err) {
            return reject(err);
        }
        return resolve(token);
    });
});

const verifyJwt = token => new Promise((resolve, reject) => {
    verify(token, options.jwtSecret, {
    }, (err, decoded) => {
        if (err) {
            return reject(err);
        }
        resolve(decoded);
    });
});

module.exports = {
    getJwt,
    verifyJwt,
}