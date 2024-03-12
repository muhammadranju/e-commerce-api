/**
 * Custom Error class for API errors.
 * Inherits from the built-in Error class.
 */

class ApiError extends Error {
  /**
   * Constructor for ApiError class.
   * @param {number} statusCode - HTTP status code for the error.
   * @param {string} message - Error message (default: "Something went wrong").
   * @param {Array} errors - Array of error details or validation errors (default: []).
   * @param {string} stack - Error stack trace (default: "").
   */

  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    // Initialize instance properties
    this.statusCode = statusCode; // HTTP status code
    this.data = null; // Additional data associated with the error
    this.message = message; // Error message
    this.success = false; // Success flag (false for errors)
    this.errors = errors; // Array of error details or validation errors

    // Set the error stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
