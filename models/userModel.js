const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Un utilisateur doit avoir un nom"],
    maxLength: [
      40,
      "Le nom d'un utilisateur doit avoir moins ou égal à 40 caractères",
    ],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Un utilisateur doit avoir un email"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Veuillez fournir un email valide"],
  },
  role: {
    type: String,
    enum: {
      values: ["client", "admin", "driver"],
      message: "Le rôle est soit: client, driver",
    },
    default: "client",
  },
  password: {
    type: String,
    required: [true, "Un utilisateur doit avoir un mot de passe"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Veuillez confirmer votre mot de passe"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Les mots de passe ne sont pas identiques!",
    },
  },
  passwordChangedAt: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
