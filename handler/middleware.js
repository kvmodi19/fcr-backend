const {verifyJwt} = require('./utils');
const {InternalServerErrorHandler} = require('./request-handler');

const authUser = async (req, res, next) => {
    try {
        const { authorization: token } = req.headers;

        if (!token) {
            return InternalServerErrorHandler(req, res, {
                unAuthorized: true,
                message: 'access_token_required',
            });
        }

        const decoded = await verifyJwt(token);

        req.user = decoded;

        next();
    } catch(err) {
        if (err.message === 'jwt expired') {
            return InternalServerErrorHandler(req, res, {
                unAuthorized: true,
                message: 'access_token_expired',
            });
        } else {
            return InternalServerErrorHandler(req, res, {
                unAuthorized: true,
                message: 'access_token_required',
            });
        }
    }
};

module.exports = {
    authUser
};