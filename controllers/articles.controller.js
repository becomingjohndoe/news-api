const { selectArticleById } = require("../models/articles.model");

exports.getArticlesById = async (req, res, next) => {
	try {
		const article = await selectArticleById(req.params);
		console.log({ article });
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};
