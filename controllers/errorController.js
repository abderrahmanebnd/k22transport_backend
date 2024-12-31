const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  // Handle cast error which means invalid id
  const message = `Invalide ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // Handle duplicate key error
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];

  // const message = `Cet ${duplicateField}: ${duplicateValue}. Please use a different ${duplicateField}.`;
  const message = `Le champ ${duplicateField} avec la valeur ${duplicateValue} existe déjà. Veuillez utiliser un ${duplicateField} différent.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleJWTError = () =>
  new AppError("Token invalide. Veuillez vous reconnecter.", 401);

const handleJWTExpiredError = () =>
  new AppError("Votre token a expiré. Veuillez vous reconnecter.", 401);

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
