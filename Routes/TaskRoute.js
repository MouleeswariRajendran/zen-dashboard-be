const taskRouter = require("express").Router();
const { postTask, fetchTask } = require("../Controllers/TaskController");

taskRouter.post("/Student/Task", postTask);

taskRouter.get("/Student/alltask", fetchTask);

module.exports = taskRouter;
