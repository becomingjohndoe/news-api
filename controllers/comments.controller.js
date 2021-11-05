const {
	selectCommentsByArticleId,
	insertComment,
	deleteCommentByCommentId,
	updateCommentVotes,
} = require("../models/comments.model");

exports.getCommentsByArticleId = async (req, res, next) => {
	try {
		const comments = await selectCommentsByArticleId(req.params);
		res.status(200).send({ comments });
	} catch (err) {
		next(err);
	}
};

exports.postComment = async (req, res, next) => {
	try {
		const comment = await insertComment(req.params, req.body);
		res.status(201).send({ comment });
	} catch (err) {
		next(err);
	}
};

exports.deleteComment = async (req, res, next) => {
	try {
		await deleteCommentByCommentId(req.params);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

exports.patchCommentVotes = async (req, res, next) => {
	try {
		const comment = await updateCommentVotes(req.params, req.body);
		res.status(200).send({ comment });
	} catch (err) {
		next(err);
	}
};
