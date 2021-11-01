const topicRouter = require("./topic.router");

const apiRouter = require("express").Router();
apiRouter.route("/");
apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
