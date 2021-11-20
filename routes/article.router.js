const {
	getArticleById,
	patchVotesByArticleId,
	getAllArticles,
	postArticle,
} = require("../controllers/articles.controller");
const {
	getCommentsByArticleId,
	postComment,
} = require("../controllers/comments.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getAllArticles).post(postArticle);

articleRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(patchVotesByArticleId);

articleRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.post(postComment);

module.exports = articleRouter;
