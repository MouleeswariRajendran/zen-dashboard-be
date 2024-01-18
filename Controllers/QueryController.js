const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Query = require("../Models/QueryModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const postQuery = async (req, res) => {
  try {
    const { queryTitle, queryDesc } = req.body;

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

    const student = await Student.findById(decodedToken.id);

    const newQuery = new Query({
      queryTitle,
      queryDesc,
      student: student._id,
    });

    const savedQuery = await newQuery.save();

    student.query = student.query.concat(savedQuery._id);

    await student.save();

    res.status(200).json({ message: "Query raised sucessfully" });
  } catch (error) {
    return res.status(400).json({ message: "Please fill the data" });
  }
};

const deleteQuery = async (req, res) => {
  try {
    const id = req.params.id;

    const token = getTokenFrom(req);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout Please log in again" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout Please log in again" });
    }

    const matchedQuery = await Query.findById(id);

    if (!matchedQuery) {
      return res.status(404).json({ message: "Query data not found" });
    }

    await Query.findByIdAndDelete(id);

    await Student.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { query: id },
      },
      { new: true }
    );

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error while updating. Please try again later" });
  }
};

const fetchQuery = async (req, res) => {
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

    const querys = await Student.findById(decodedToken.id).populate("query");

    res.status(200).json(querys.query);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while fetching the data please login & try again" });
  }
};

module.exports = {
  postQuery,
  deleteQuery,
  fetchQuery,
};
