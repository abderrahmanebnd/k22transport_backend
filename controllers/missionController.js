const Mission = require("../models/missionModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
exports.restrictUpdateFieldsByRole = (rolePermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const allowedFields = rolePermissions[userRole];
    if (!allowedFields) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    req.body = Object.keys(req.body)
      .filter((field) => allowedFields.includes(field))
      .reduce((filteredBody, key) => {
        filteredBody[key] = req.body[key];
        return filteredBody;
      }, {});

    if (Object.keys(req.body).length === 0) {
      return next(
        new AppError(
          `You can only update the following fields: ${allowedFields.join(", ")}`,
          400,
        ),
      );
    }

    next();
  };
};

exports.createMission = factory.createOne(Mission, "mission");
exports.getAllMissions = factory.getAll(Mission, "missions");
exports.getMission = factory.getOne(Mission, "mission");
exports.deleteMission = factory.deleteOne(Mission, "mission");
exports.updateMission = factory.updateOne(Mission, "mission");
