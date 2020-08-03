const BadRequestHandler = (req, res, error) => {
	return res.status(400).send({isSuccess: false, message: error.message});
};

const ResourceExistsRequestHandler = (req, res, error) => {
	return res.status(409).send({isSuccess: false, message: error.message});
};

const NotFoundRequestHandler = (req, res, error) => {
	return res.status(404).send({isSuccess: false, message: error.message});
};

module.exports = {
	BadRequestHandler,
	ResourceExistsRequestHandler,
	NotFoundRequestHandler
};