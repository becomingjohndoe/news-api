const db = require("../db/connection");
const { selectTopicBySlug } = require("./topics.models");

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
	if (Object.values(votes).length > 1) {
		return Promise.reject({
			status: 400,
			msg: "Invalid vote increment",
		});
	}
	const queries = [];
	const { inc_votes } = votes;
	if (!inc_votes) {
		queries.push(0);
	} else {
		queries.push(inc_votes);
	}
	queries.push(article_id);
	const { rows } = await db.query(
		`UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING*;`,
		queries
	);
	return rows[0];
};

exports.selectAllArticles = async (
	sort_by = "created_at",
	order = "DESC",
	topic
) => {
	if (topic) {
		if ((await selectTopicBySlug(topic)) === undefined) {
			return Promise.reject({
				status: 404,
				msg: `topic: ${topic} does not exist`,
			});
		}
	}
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
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `;

	if (topic) {
		queries.push(topic);
		queryStr += ` WHERE articles.topic = $1`;
	}

	queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

	const { rows } = await db.query(queryStr, queries);

	return rows;
};
