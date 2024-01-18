const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Task = require("../Models/TaskModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const postTask = async (req, res) => {
  try {
    const {
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
    } = req.body;

    const token = getTokenFrom(req);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const student = await Student.findById(decodedToken.id);

    const matchedtask = await Task.findOne({ check });
    if (matchedtask) {
      res.status(400).json({ message: "Task already submitted" });
      return;
    }

    const newTask = new Task({
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
      student: student._id,
    });

    const savedTask = await newTask.save();

    student.task = student.task.concat(savedTask._id);

    await student.save();

    res.status(200).json({ message: "Task submitted sucessfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while updating please try again later" });
  }
};

const fetchTask = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "token invalid" });
    }

    const tasks = await Student.findById(decodedToken.id).populate("task");

    res.status(200).json(tasks.task);
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Error while fetching the data please login & try again",
      });
  }
};

module.exports = { postTask, fetchTask };
