const {
	deleteComment,
	patchCommentVotes,
} = require("../controllers/comments.controller");

const commentRouter = require("express").Router();

commentRouter
	.route("/:comment_id")
	.delete(deleteComment)
	.patch(patchCommentVotes);

module.exports = commentRouter;
