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

exports.updateArticleById = async ({ article_id }, { inc_votes }) => {
	const { rows } = await db.query(
		`UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING*;`,
		[inc_votes, article_id]
	);
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
	return rows;
};
