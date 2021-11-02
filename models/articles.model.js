const db = require("../db/connection");

exports.selectArticleById = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
		[article_id]
	);
	if (rows) next({ status: 404, msg: "Article not Found" });
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

exports.selectAllArticles = async (queries) => {
	const { rows } = await db.query(
		`SELECT * 
    FROM articles
    ;`
	);
	return rows;
};
