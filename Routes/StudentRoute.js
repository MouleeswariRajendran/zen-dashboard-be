const studentRouter = require("express").Router();

const {
  signupStudent,
  updateStudent,
  confirmStudent,
  forgotPassword,
  resetPassword,
} = require("../Controllers/StudentController");

studentRouter.post("/Student/signup", signupStudent);

studentRouter.put("/Student/update", updateStudent);

studentRouter.patch("/Student/confirm/:id", confirmStudent);

studentRouter.put("/Student/forgot", forgotPassword);

studentRouter.patch("/Student/reset/:id", resetPassword);

module.exports = studentRouter;
