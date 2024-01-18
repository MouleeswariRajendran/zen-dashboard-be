const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: [true, "Valid reason"],
  },
  appliedOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Waiting for Approval",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Leave", LeaveSchema, "leaves");
