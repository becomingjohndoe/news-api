const db = require("../db/connection");
const { selectTopicBySlug } = require("../models/topics.models");

exports.checkupdateVotesByArticleIdParams = async (article_id, votes) => {
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
	return queries;
};

exports.checkSelectAllArticlesQueries = async (sort_by, order, topic) => {
	if (topic) {
		await selectTopicBySlug(topic);
	}
	if (
		!["title", "topic", "author", "body", "created_at", "votes"].includes(sort_by)
	) {
		return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
	}
	if (!["ASC", "DESC", "asc", "desc"].includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid order query" });
	}
};

exports.buildSelectAllArticlesQuery = async (sort_by, order, topic) => {
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
	return { queryStr: queryStr, queries: queries };
};
