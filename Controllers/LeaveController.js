const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Leave = require("../Models/LeaveModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
};

const postLeave = async (req, res) => {
  try {
    const { reason } = req.body;

    const token = getTokenFrom(req);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout Please login again" });
    }

    const student = await Student.findById(decodedToken.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newLeave = new Leave({
      reason,
      student: student._id,
    });

    const savedLeave = await newLeave.save();

    student.leave = student.leave.concat(savedLeave._id);

    await student.save();

    res.status(200).json({ message: "Leave submitted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

const fetchLeave = async (req, res) => {
  try {
    const token = getTokenFrom(req);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout Please log in again" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const student = await Student.findById(decodedToken.id).populate("leave");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.leave);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Error while fetching the data Please log in and try again",
      });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const id = req.params.id;

    const token = getTokenFrom(req);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const matchedLeave = await Leave.findById(id);

    if (!matchedLeave) {
      return res.status(401).json({ message: "Leave data not found" });
    }

    await Leave.findByIdAndDelete(id);

    await Student.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { leave: id },
      },
      { new: true }
    );

    res.status(200).json({ message: "Deleted sucessfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating, please try again later" });
  }
};

module.exports = {
  postLeave,
  fetchLeave,
  deleteLeave,
};
