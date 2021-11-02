const {
	getCommentsByArticleId,
} = require("../controllers/comments.controller");

const commentRouter = require("express").Router();

commentRouter.route("/").get(getCommentsByArticleId);

module.exports = commentRouter;
