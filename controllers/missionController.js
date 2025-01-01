const Mission = require("../models/missionModel");
const factory = require("./handlerFactory");

exports.createMission = factory.createOne(Mission);
