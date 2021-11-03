const { selectAllUsers, selectUserById } = require("../models/users.model");

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await selectAllUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};

exports.getUserById = async (req, res, next) => {
	try {
		const user = await selectUserById(req.params);
	} catch (err) {
		next(err);
	}
};
