// const User = require("../models/userModel");
// const Mission = require("../models/missionModel");
// const catchAsync = require("../utils/catchAsync");

// exports.getStats = catchAsync(async (req, res, next) => {
//   const totalClients = await User.countDocuments({ role: "client" });

//   const totalChauffeurs = await User.countDocuments({ role: "driver" });

//   const totalMissions = await Mission.countDocuments();

//   const completedMissions = await Mission.countDocuments({
//     status: "completed",
//   });

//   // Send response
//   res.status(200).json({
//     status: "success",
//     data: {
//       totalUsers: totalChauffeurs + totalClients,
//       totalClients,
//       totalChauffeurs,
//       totalMissions,
//       completedMissions,
//     },
//   });
// });

const User = require("../models/userModel");
const Mission = require("../models/missionModel");
const catchAsync = require("../utils/catchAsync");

exports.getAdminStats = catchAsync(async (req, res, next) => {
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        //   totalUsers: { $sum: 1 },
        totalClients: {
          $sum: {
            $cond: [{ $eq: ["$role", "client"] }, 1, 0],
          },
        },
        totalChauffeurs: {
          $sum: {
            $cond: [{ $eq: ["$role", "driver"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const missionStats = await Mission.aggregate([
    {
      $group: {
        _id: null,
        totalMissions: { $sum: 1 },
        completedMissions: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
  ]);

  // Send response
  res.status(200).json({
    status: "success",
    stats: {
      totalUsers:
        userStats[0]?.totalClients + userStats[0]?.totalChauffeurs || 0,
      totalClients: userStats[0]?.totalClients || 0,
      totalChauffeurs: userStats[0]?.totalChauffeurs || 0,
      totalMissions: missionStats[0]?.totalMissions || 0,
      completedMissions: missionStats[0]?.completedMissions || 0,
    },
  });
});

exports.getDriverStats = catchAsync(async (req, res, next) => {
  const driverId = req.user.id;

  const [totalMissions, completedMissions] = await Promise.all([
    Mission.countDocuments({ assignedDriver: driverId }),
    Mission.countDocuments({ assignedDriver: driverId, status: "completed" }),
  ]);

  res.status(200).json({
    status: "success",
    stats: {
      totalMissions,
      completedMissions,
    },
  });
});
