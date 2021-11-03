const db = require("../db/connection");

exports.selectAllUsers = async () => {
	const { rows } = await db.query(`SELECT username FROM users;`);
	return rows;
};

exports.selectUserByName = async ({ username }) => {
	const { rows } = await db.query(
		`SELECT * FROM users WHERE username LIKE $1;`,
		[`%${username}%`]
	);
	return rows[0];
};
