const {
	getArticlesById,
	patchVotesByArticleId,
	getAllArticles,
} = require("../controllers/articles.controller");
const {
	getCommentsByArticleId,
	postComment,
} = require("../controllers/comments.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getAllArticles);

articleRouter
	.route("/:article_id")
	.get(getArticlesById)
	.patch(patchVotesByArticleId);

articleRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.post(postComment);

module.exports = articleRouter;
