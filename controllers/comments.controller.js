const { selectCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = async (req, res, next) => {
	try {
		const comments = await selectCommentsByArticleId(req.params);
		res.status(200).send({ comments });
	} catch (err) {
		next(err);
	}
};
