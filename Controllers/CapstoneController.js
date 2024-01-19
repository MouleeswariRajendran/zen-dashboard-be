
const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Capstone = require("../Models/CapstoneModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
};

const fetchCapstone = async (req, res) => {
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

    const capstones = await Student.findById(decodedToken.id).populate(
      "capstone"
    );

    res.status(200).json(capstones.capstone);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error fetching data please login & try again" });
  }
};

const postCapstone = async (req, res) => {
  try {
    const { frontEndUrl, backEndUrl, frontEndCode, backEndCode } = req.body;

    const token = getTokenFrom(req);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const capstones = await Student.findById(decodedToken.id).populate(
      "capstone"
    );

    if (capstones.capstone.length) {
      return res.status(401).json({ message: "Already Submitted" });
    }

    const student = await Student.findById(decodedToken.id);

    const newCapstone = new Capstone({
      frontEndUrl,
      backEndUrl,
      frontEndCode,
      backEndCode,
      student: student._id,
    });

    const savedCapstone = await newCapstone.save();

    student.capstone = student.capstone.concat(savedCapstone._id);

    await student.save();

    res
      .status(200)
      .json({ data: newCapstone, message: "Submitted sucessfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating please try again later" });
  }
};

module.exports = {
  fetchCapstone,
  postCapstone,
};
