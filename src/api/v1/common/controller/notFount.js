const ApiError = require("../../../../utils/ApiError");

/**
 * Middleware function to handle not found errors.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
const notFoundHandler = (req, res, next) => {
  // Create a new ApiError instance with a 404 status code and a custom message.
  const error = new ApiError(
    404,
    `Con't find ${req.originalUrl} on the server!`
  );

  // Call the next middleware function with the error.
  next(error);
};

module.exports = notFoundHandler;
