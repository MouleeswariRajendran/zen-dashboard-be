const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First name"],
  },

  lastname: {
    type: String,
    required: [true, "Last name"],
  },

  batch: {
    type: String,
    default: "B52-WDTAMIL",
  },

  email: {
    type: String,
    required: [true, "Email address"],
    unique: [],
  },
  contact: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "please add password"],
  },
  resetToken: {
    type: String,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  codeKata: {
    type: String,
    default: "0",
  },
  webKata: {
    type: String,
    default: "0",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  mockInterview: {
    type: String,
    default: "0",
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  leave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
  portfolio: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
    },
  ],
  capstone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capstone",
    },
  ],
  webcode: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webcode",
    },
  ],
  query: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
    },
  ],
  mock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mock",
    },
  ],
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema, "students");
