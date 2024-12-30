const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();

app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

module.exports = app;
