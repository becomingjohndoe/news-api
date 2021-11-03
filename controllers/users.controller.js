const { selectAllUsers } = require("../models/users.model");

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await selectAllUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};
