const portfolioRouter = require("express").Router();
const { postPortfolio, fetchPortfolio } = require("../Controllers/PortfolioController");

portfolioRouter.post("/Student/Portfolio", postPortfolio);

portfolioRouter.get("/Student/Portfolio", fetchPortfolio);

module.exports = portfolioRouter;
