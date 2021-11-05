exports.handleCustoms = (err, req, res, next) => {
	console.log(err);
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePSQLS = (err, req, res, next) => {
	console.log(err);
	if (err.code === "22P02") res.status(400).send({ msg: "Invalid input type" });
	if (err.code === "23503") res.status(404).send({ msg: "Resource not found" });
};
