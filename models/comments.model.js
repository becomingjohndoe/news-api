const db = require("../db/connection");
const { selectArticleById } = require("./articles.model");

exports.selectCommentsByArticleId = async ({ article_id }, { limit, p }) => {
	const queries = [article_id];
	let queryStr = `SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE article_id = $1`;

	queryStr += ` ORDER BY created_at DESC`;
	if (limit) {
		const offset = p * limit;
		queries.push(limit, offset);
		queryStr += `LIMIT $2 OFFSET $3`;
	}

	const { rows } = await db.query(queryStr, queries);

	// check if article_id exists in articles table
	// will return Promise reject if no articles found
	await selectArticleById({ article_id });

	return rows;
};

exports.selectCommentsById = async (id) => {
	const { rows } = await db.query(
		`SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE comment_id = $1;`,
		[id]
	);

	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `no comment found for comment ID ${id}`,
		});
	}
};

exports.insertComment = async ({ article_id }, { username, body }) => {
	if (!(username && body)) {
		return Promise.reject({ status: 400, msg: "Empty post request" });
	}

	const { rows } = await db.query(
		`INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING*;`,
		[body, username, article_id]
	);
	return rows[0];
};

exports.deleteCommentByCommentId = async ({ comment_id }) => {
	const { rows } = await db.query(
		`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`,
		[comment_id]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `no comment found for comment ID ${comment_id}`,
		});
	}
};

exports.updateCommentVotes = async ({ comment_id }, { inc_votes }) => {
	if (!inc_votes) {
		return Promise.reject({ status: 400, msg: "Empty post request" });
	}
	const { rows } = await db.query(
		`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`,
		[inc_votes, comment_id]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `no comment found for comment ID ${comment_id}`,
		});
	}
	return rows[0];
};
