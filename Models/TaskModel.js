const mongoose = require("mongoose");


const TaskSchema = new mongoose.Schema({
  day: {
    type:Date,
    default: Date.now,
  },
  frontEndCode: {
    type: String,
  },
  frontEndURL: {
    type: String,
  },
  backEndCode: {
    type: String,
  },
  backEndURL: {
    type: String,
  },
  score: {
    type: String,
    default: "Yet to be graded",
  },
  task: {
    type: String,
    required: [true, "Task No. missing"],
  },
  title: {
    type: String,
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  check: {
    type: String,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});


module.exports = mongoose.model("Task", TaskSchema, "tasks");
