const {
	selectArticleById,
	updateArticleById,
} = require("../models/articles.model");

exports.getArticlesById = async (req, res, next) => {
	try {
		const article = await selectArticleById(req.params);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.patchArticleById = async (req, res, next) => {
	try {
		const article = await updateArticleById(req.params);
		res.status(201).send({ article });
	} catch (err) {
		next(err);
	}
};
