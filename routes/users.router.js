const {
	getAllUsers,
	getUserByName,
} = require("../controllers/users.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers);
userRouter.route("/:username").get(getUserByName);
module.exports = userRouter;
