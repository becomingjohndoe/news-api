const {
	getArticlesById,
	patchArticleById,
	getAllArticles,
} = require("../controllers/articles.controller");
const commentRouter = require("./comments.router");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getAllArticles);

articleRouter
	.route("/:article_id")
	.get(getArticlesById)
	.patch(patchArticleById);

articleRouter.use("/:article_id/comments", commentRouter);

module.exports = articleRouter;
