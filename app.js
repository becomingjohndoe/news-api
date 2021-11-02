const express = require("express");
const {
	handleCustoms,
	handlePSQLS,
} = require("./controllers/errors.controller");
const apiRouter = require("./routes/api.router");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Invalid URL" });
});
app.use(handleCustoms);
app.use(handlePSQLS);
module.exports = app;
