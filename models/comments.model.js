const db = require("../db/connection");
const { isUser } = require("../utils/isUser");
const { selectArticleById } = require("./articles.model");

exports.selectCommentsByArticleId = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE article_id = $1;`,
		[article_id]
	);
	// check if article_id exists in articles table
	// will return Promise reject if no articles found
	await selectArticleById({ article_id });

	return rows;
};

exports.insertComment = async ({ article_id }, { username, body }) => {
	if (!(username && body)) {
		return Promise.reject({ status: 400, msg: "Empty post request" });
	}
	if (!(await isUser(username))) {
		return Promise.reject({
			status: 404,
			msg: `User ${username} does not exist`,
		});
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
