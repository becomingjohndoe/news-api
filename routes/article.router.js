const {
	getArticlesById,
	patchArticleById,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter
	.route("/:article_id")
	.get(getArticlesById)
	.patch(patchArticleById);

module.exports = articleRouter;
