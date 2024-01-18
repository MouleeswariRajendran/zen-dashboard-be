const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Portfolio = require("../Models/PortfolioModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const postPortfolio = async (req, res) => {
  try {
    const { portfolioURL, githubURL, resumeURL } = req.body;

    const token = getTokenFrom(req);
    console.log("🚀 ~ file: portfolio.js:26 ~ postPortfolio ~ token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout please login again" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout Please log in again" });
    }

    const student = await Student.findById(decodedToken.id).populate(
      "portfolio"
    );

    if (student.portfolio.length > 0) {
      return res.status(401).json({ message: "Portfolio already submitted" });
    }

    const newPortfolio = new Portfolio({
      portfolioURL,
      githubURL,
      resumeURL,
      student: student._id,
    });

    const savedPortfolio = await newPortfolio.save();

    student.portfolio = [savedPortfolio._id];

    await student.save();

    res.status(200).json({ message: "Portfolio submitted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error while updating Please try again later" });
  }
};

const fetchPortfolio = async (req, res) => {
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

    const portfolios = await Student.findById(decodedToken.id).populate(
      "Portfolio"
    );

    res.status(200).json(portfolios.portfolio);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error fetching the data please login & try again" });
  }
};

module.exports = {
  postPortfolio,
  fetchPortfolio,
};
