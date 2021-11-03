const db = require("../db/connection");

exports.selectAllUsers = async () => {
	const { rows } = await db.query(`SELECT username FROM users;`);
	return rows;
};
