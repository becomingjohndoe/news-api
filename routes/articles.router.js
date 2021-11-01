const articleRouter = require("express").Router();

articleRouter.route("/");

articleRouter.route("/article_id").get();

module.exports = articleRouter;
