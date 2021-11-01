exports.handleCustoms = (err, req, res, next) => {
	console.log(err);
	res.status(404).send({ msg: "article not found" });
};
