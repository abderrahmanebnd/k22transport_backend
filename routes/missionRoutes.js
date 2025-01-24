const express = require("express");
const missionController = require("../controllers/missionController");
const authController = require("../controllers/authController");
const permissions = require("../config/permissions");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    missionController.getAllMissions,
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    missionController.createMission,
  );

router
  .route("/my-missions")
  .get(
    authController.protect,
    authController.restrictTo("driver"),
    missionController.getMyMissions,
  );

router
  .route("/by-matricule")
  .get(
    authController.protect,
    authController.restrictTo("client"),
    missionController.getMissionsByCarMatricule,
  );

router
  .route("/:id")
  .get(authController.protect, missionController.getMission)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    missionController.deleteMission,
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "driver"),
    missionController.restrictUpdateFieldsByRole(permissions),
    missionController.updateMission,
  );

module.exports = router;
