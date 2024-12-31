const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const missionRouter = require("./routes/missionRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

app.use("/api/v1/missions", missionRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
