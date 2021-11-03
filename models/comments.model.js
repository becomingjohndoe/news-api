const db = require("../db/connection");

exports.selectCommentsByArticleId = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE article_id = $1;`,
		[article_id]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: `no comments found for article ID ${article_id}`,
		});
	}
	return rows;
};

exports.insertComment = async ({ article_id }, { username, body }) => {
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
