const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  portfolioURL: {
    type: String,
    required: [true, "Porfolio URL is missing"],
  },
  githubURL: {
    type: String,
    required: [true, "Github URL is missing"],
  },
  resumeURL: {
    type: String,
    required: [true, "Resume URL is missing"],
  },
  reveiwedBy: {
    type: String,
    default: "Not yet reviewed",
  },
  status: {
    type: String,
    default: "Submitted",
  },
  comment: {
    type: String,
    default: "Not yet reviewed",
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema, "portfolios");
