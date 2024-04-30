/**
 * Error handler middleware.
 *
 * @param {Error} err - The error that occurred.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} _next - The next middleware function.
 * @return {Object} The response containing error details.
 */
const errorHandler = (err, _req, res, _next) => {
  // Set the HTTP status code to the error status code if available,
  // otherwise set it to 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;

  // Prepare the response object with the error details.
  const response = {
    status: err.status,
    statusCode,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  };

  // Send the response with the error details.
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
