const { selectAllUsers, selectUserByName } = require("../models/users.model");

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await selectAllUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};

exports.getUserByName = async (req, res, next) => {
	try {
		const user = await selectUserByName(req.params);
		res.status(200).send({ user });
	} catch (err) {
		next(err);
	}
};
