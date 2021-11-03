const db = require("../db/connection");

exports.selectAllUsers = async () => {
	const { rows } = await db.query(`SELECT username FROM users;`);
	return rows;
};

exports.selectUserById = async ({ user_id }) => {
	const { rows } = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [
		user_id,
	]);
	return rows[0];
};
