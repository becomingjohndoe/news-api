const { getAllUsers } = require("../controllers/users.controller");
const { selectUserById } = require("../models/users.model");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers);
userRouter.route("/:user_id").get(selectUserById);
module.exports = userRouter;
