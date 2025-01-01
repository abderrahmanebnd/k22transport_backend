const express = require("express");
const missionController = require("../controllers/missionController");
const router = express.Router();

router
  .route("/")
  //   .get(missionController.getAllMissions)
  .post(missionController.createMission);

module.exports = router;
