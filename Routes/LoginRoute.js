const loginRouter = require("express").Router();
const { login } = require("../Controllers/LoginController");

loginRouter.post("/Student/Login", login);

module.exports = loginRouter;
