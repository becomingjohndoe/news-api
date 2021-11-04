const {
	selectArticleById,
	updateVotesByArticleId,
	selectAllArticles,
} = require("../models/articles.model");

exports.getArticleById = async (req, res, next) => {
	try {
		const article = await selectArticleById(req.params);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.patchVotesByArticleId = async (req, res, next) => {
	try {
		const article = await updateVotesByArticleId(req.params, req.body);
		res.status(201).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.getAllArticles = async (req, res, next) => {
	const { sort_by, order, topic } = req.query;
	try {
		const articles = await selectAllArticles(sort_by, order, topic);
		res.status(200).send({ articles });
	} catch (err) {
		next(err);
	}
};
