const mongoose = require("mongoose");

const CapstoneSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Zen Class student dashboard",
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
    default: "submitted",
  },
  frontEndUrl: {
    type: String,
    required: [true, "Frontend URL is missing"],
  },
  backEndUrl: {
    type: String,
    required: [true, "Backend URL is missing"],
  },
  frontEndCode: {
    type: String,
    required: [true, "Frontend Code URL is missing"],
  },
  backEndCode: {
    type: String,
    required: [true, "Backend Code URL is missing"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// create a model
module.exports = mongoose.model("Capstone", CapstoneSchema, "capstones");
