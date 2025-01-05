const express = require("express");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const missionRouter = require("./routes/missionRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to the domain of your frontend (e.g., your React app)
    methods: ["GET", "POST", "PUT", "DELETE"], // List the HTTP methods you want to allow
    allowedHeaders: ["Content-Type", "Authorization"], // Define allowed headers
    credentials: true, // Allow cookies to be sent with requests
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.use("/api/v1/missions", missionRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
