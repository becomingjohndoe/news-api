exports.handleCustoms = (err, req, res, next) => {
	console.log(err.code);
	if (err.status) res.status(err.status).send({ msg: err.msg });
};
