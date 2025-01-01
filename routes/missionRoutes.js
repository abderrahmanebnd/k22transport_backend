const express = require("express");
const missionController = require("../controllers/missionController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  //   .get(missionController.getAllMissions)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    missionController.createMission,
  );

module.exports = router;
