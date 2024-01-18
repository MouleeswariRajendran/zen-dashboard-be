const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  queryTitle: {
    type: String,
    required: [true, "title is missing"],
  },
  queryDesc: {
    type: String,
    required: [true, "Description is missing"],
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Not assigned",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Query", QuerySchema, "querys");
