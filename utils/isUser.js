const db = require("../db/connection");

exports.isUser = async (user) => {
	const { rows } = await db.query(`SELECT * FROM users WHERE username = $1;`, [
		user,
	]);
	return rows.length === 0 ? false : true;
};
