const db = require("../db/connection");

exports.selectCommentsByArticleId = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE article_id = $1;`,
		[article_id]
	);
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
	console.log(rows);
	return rows[0];
};

exports.deleteCommentByCommentId = async ({ comment_id }) => {
	await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};
