exports.handleCustoms = (err, req, res, next) => {
	console.log(err.code);
	if (err.status) res.status(err.status).send({ msg: err.msg });
	else next(err);
};

exports.handlePSQLS = (err, req, res, next) => {
	console.log(err.code);
	if (err.code === "22P02") res.status(404).send({ msg: "article not found" });
};
