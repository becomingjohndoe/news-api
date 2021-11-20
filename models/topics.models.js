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

exports.insertTopic = async (slug, description) => {
	const { rows } = await db.query(
		`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
		[slug, description]
	);
	return rows[0];
};
