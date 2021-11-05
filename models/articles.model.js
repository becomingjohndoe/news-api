const db = require("../db/connection");
const {
	checkupdateVotesByArticleIdParams,
	checkSelectAllArticlesQueries,
	buildSelectAllArticlesQuery,
} = require("../utils/model.utils");

exports.selectArticleById = async ({ article_id }) => {
	const { rows } = await db.query(
		`SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
		[article_id]
	);
	if (rows.length === 0) {
		return Promise.reject({ status: 404, msg: "article_id does not exist" });
	}
	return rows[0];
};

exports.updateVotesByArticleId = async ({ article_id }, votes) => {
	const queries = await checkupdateVotesByArticleIdParams(article_id, votes);

	const { rows } = await db.query(
		`UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING*;`,
		queries
	);

	if (rows.length === 0) {
		return Promise.reject({ status: 404, msg: "article_id does not exist" });
	}

	return rows[0];
};

exports.selectAllArticles = async (
	sort_by = "created_at",
	order = "DESC",
	topic
) => {
	await checkSelectAllArticlesQueries(sort_by, order, topic);

	const { queryStr, queries } = await buildSelectAllArticlesQuery(
		sort_by,
		order,
		topic
	);

	const { rows } = await db.query(queryStr, queries);

	return rows;
};
