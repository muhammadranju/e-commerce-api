const ApiError = require("../../utils/ApiError");

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Con't find ${req.originalUrl} on the server!`
  );
  next(error);
};
const errorHandler = (err, _req, res, _next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  });
};

module.exports = { notFoundHandler, errorHandler };
