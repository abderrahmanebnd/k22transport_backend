const express = require("express");
const {
  getAdminStats,
  getDriverStats,
} = require("../controllers/generalFuctionsController");
const authController = require("../controllers/authController");
const generalRouter = express.Router();

generalRouter.get(
  "/admin-stats",
  authController.protect,
  authController.restrictTo("admin"),
  getAdminStats,
);
generalRouter.get(
  "/driver-stats",
  authController.protect,
  authController.restrictTo("driver"),
  getDriverStats,
);

module.exports = generalRouter;
