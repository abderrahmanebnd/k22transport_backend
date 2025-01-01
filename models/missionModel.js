const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Une mission doit avoir un titre"],
    maxLength: [
      50,
      "Le titre d'une mission doit contenir moins ou égal à 40 caractères",
    ],
  },
  description: {
    type: String,
    maxLength: [
      300,
      "La description d'une mission doit contenir moins ou égal à 200 caractères",
    ],
  },
  status: {
    type: String,
    enum: ["in_progress", "completed"],
    default: "in_progress",
  },
  assignedDriver: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Une mission doit avoir un chauffeur assigné"],
  },
  carMatricule: {
    type: String,
    validate: {
      validator: function (el) {
        const regex = /^[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}$/;
        return regex.test(el.toUpperCase());
      },
      message: "Le matricule d'une voiture doit suivre le format AA-001-AA",
    },
    required: [true, "Une mission doit avoir une voiture assignée"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Query Middleware
missionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
