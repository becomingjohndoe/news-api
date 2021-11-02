const commentRouter = require("express").Router();

commentRouter.route("/").get();

module.exports = commentRouter;
