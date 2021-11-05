const db = require("../db/connection");

exports.selectTopics = async () => {
	const { rows } = await db.query(`SELECT * FROM topics;`);
	return rows;
};

exports.selectTopicBySlug = async (slug) => {
	const { rows } = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
		slug,
	]);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `topic: ${slug} does not exist`,
		});
	}
	return rows[0];
};
