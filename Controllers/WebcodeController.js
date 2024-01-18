const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Webcode = require("../Models/WebcodeModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const postWebcode = async (req, res) => {
  try {
    const { frontEndUrl, frontEndCode } = req.body;

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

    const webcodes = await Student.findById(decodedToken.id).populate(
      "webcode"
    );

    if (webcodes.webcode.length) {
      return res.status(401).json({ message: "Already Submitted" });
    }

    const student = await Student.findById(decodedToken.id);

    const newWebcode = new Webcode({
      frontEndUrl,
      frontEndCode,
      student: student._id,
    });

    const savedWebcode = await newWebcode.save();

    student.webcode = student.webcode.concat(savedWebcode._id);

    await student.save();

    res.status(200).json({ message: "Webcode submitted sucessfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while updating please try again later" });
  }
};

const fetchWebcode = async (req, res) => {
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

    const webcodes = await Student.findById(decodedToken.id).populate(
      "webcode"
    );

    res.status(200).json(webcodes.webcode);
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Error while fetching the data please login & try again",
      });
  }
};

module.exports = {
  postWebcode,
  fetchWebcode,
};
