const { getArticlesById } = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/:article_id").get(getArticlesById);

module.exports = articleRouter;
