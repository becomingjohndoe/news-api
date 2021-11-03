const { endpoints } = require("../endpoints");
const articleRouter = require("./article.router");
const commentRouter = require("./comments.router");
const topicRouter = require("./topic.router");

const apiRouter = require("express").Router();
apiRouter.route("/").get((req, res) => {
	res.status(200).send(endpoints);
});
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
module.exports = apiRouter;
