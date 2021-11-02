const db = require("../db/connection");

exports.selectArticleById = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
		[article_id]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `article ID ${article_id} not found`,
		});
	}
	return rows[0];
};

exports.updateVotesByArticleId = async ({ article_id }, votes) => {
	if (Object.values(votes).length > 1) {
		return Promise.reject({
			status: 400,
			msg: "Invalid vote increment",
		});
	}
	const { inc_votes } = votes;
	if (!inc_votes) {
		return Promise.reject({ status: 400, msg: "Increment can not be null" });
	}
	const { rows } = await db.query(
		`UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING*;`,
		[inc_votes, article_id]
	);

	console.log(rows);
	return rows[0];
};

exports.selectAllArticles = async (
	sort_by = "created_at",
	order = "DESC",
	topic
) => {
	if (
		!["title", "topic", "author", "body", "created_at", "votes"].includes(sort_by)
	) {
		return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
	}
	if (!["ASC", "DESC", "asc", "desc"].includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid order query" });
	}
	const queries = [];
	let queryStr = `
    SELECT *
    FROM articles`;
	if (topic) {
		queries.push(topic);
		queryStr += ` WHERE topic = $1`;
	}
	queryStr += ` ORDER BY ${sort_by} ${order};`;
	const { rows } = await db.query(queryStr, queries);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `No articles for topic: ${topic} found`,
		});
	}
	return rows;
};
