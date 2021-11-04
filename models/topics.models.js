const db = require("../db/connection");

exports.selectTopics = async () => {
	const { rows } = await db.query(`SELECT * FROM topics;`);
	return rows;
};

exports.selectTopicBySlug = async (slug) => {
	const { rows } = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
		slug,
	]);
	return rows[0];
};
