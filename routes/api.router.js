const articleRouter = require("./article.router");
const topicRouter = require("./topic.router");

const apiRouter = require("express").Router();
// apiRouter.route("/");
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
module.exports = apiRouter;
