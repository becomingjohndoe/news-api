const express = require("express");
const cors = require("cors");
const {
	handleCustoms,
	handlePSQLS,
} = require("./controllers/errors.controller");
const apiRouter = require("./routes/api.router");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Invalid URL" });
});
app.use(handleCustoms);
app.use(handlePSQLS);
module.exports = app;
