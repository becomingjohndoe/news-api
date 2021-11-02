const {
	getArticlesById,
	patchArticleById,
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
	.patch(patchArticleById);

articleRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.post(postComment);

module.exports = articleRouter;
