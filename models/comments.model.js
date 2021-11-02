const db = require("../db/connection");

exports.selectCommentsByArticleId = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT comment_id, body, votes, author, created_at
    FROM comments
    WHERE article_id = $1;`,
		[article_id]
	);
	console.log(rows);
	return rows;
};
