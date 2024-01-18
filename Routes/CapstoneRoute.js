const capstoneRouter = require("express").Router();
const { fetchCapstone, postCapstone } = require("../Controllers/CapstoneController");

capstoneRouter.get("/Student/Capstone", fetchCapstone);

capstoneRouter.post("/Student/Capstone", postCapstone);

module.exports = capstoneRouter;
