const mongoose = require("mongoose");

const MockInterviewSchema = new mongoose.Schema({
  interviewDate: {
    type: String,
  },
  interviewerName: {
    type: String,
  },
  interviewRound: {
    type: String,
  },
  attended: {
    type: String,
    default: "Yes",
  },
  comment: {
    type: String,
  },
  logicalScore: {
    type: String,
  },
  overallScore: {
    type: String,
  },
  recordingURL: {
    type: String,
    default: "https://www.google.com/",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Mock", MockInterviewSchema, "mocks");
