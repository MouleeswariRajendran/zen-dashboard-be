const leaveRouter = require("express").Router();
const { postLeave, fetchLeave, deleteLeave } = require("../Controllers/LeaveController");

leaveRouter.post("/Student/Leave", postLeave);

leaveRouter.get("/Student/Leave", fetchLeave);

leaveRouter.delete("/Student/Leave/:id", deleteLeave);

module.exports = leaveRouter;
