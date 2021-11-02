const {
	getArticlesById,
	patchArticleById,
	getAllArticles,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter
	.route("/:article_id")
	.get(getArticlesById)
	.patch(patchArticleById);

articleRouter.route("/").get(getAllArticles);

module.exports = articleRouter;
