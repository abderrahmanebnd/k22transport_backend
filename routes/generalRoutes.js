const express = require("express");
const { getStats } = require("../controllers/generalFuctionsController");
const authController = require("../controllers/authController");
const generalRouter = express.Router();

generalRouter.get(
  "/stats",
  authController.protect,
  authController.restrictTo("admin"),
  getStats,
);

module.exports = generalRouter;
