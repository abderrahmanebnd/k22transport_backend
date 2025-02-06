const Mission = require("../models/missionModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

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

exports.getMyMissions = factory.getAll(Mission, "missions", (req) => {
  return { assignedDriver: req.user.id };
});

exports.getMissionsByCarMatricule = catchAsync(async (req, res, next) => {
  const { carMatricule } = req.query;

  const features = new APIFeatures(Mission.find({ carMatricule }), req.query);
  await features.setTotalDocs();
  features.filter().paginate().sort();
  const missions = await features.query;
  res.status(200).json({
    status: "success",
    pagination: features.getPaginationDetails(),
    missions,
  });
});
