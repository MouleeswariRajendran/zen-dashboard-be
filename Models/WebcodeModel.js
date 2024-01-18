const mongoose = require("mongoose");

const WebcodeSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Pokemon API",
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    default: "Waiting for the review",
  },
  score: {
    type: String,
    default: "Waiting for the review",
  },
  status: {
    type: String,
    default: "pending",
  },
  frontEndUrl: {
    type: String,
    required: [true, "Frontend URL is missing"],
  },
  frontEndCode: {
    type: String,
    required: [true, "Frontend Code URL is missing"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Webcode", WebcodeSchema, "webcodes");
