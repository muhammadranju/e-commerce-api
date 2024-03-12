/**
 * Class representing an API response.
 */
class ApiResponse {
  /**
   * Constructor for ApiResponse class.
   * @param {number} statusCode - HTTP status code for the response.
   * @param {any} data - Data to be included in the response body.
   * @param {string} message - Response message (default: "Success").
   */

  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code
    this.data = data; // Data to be included in the response body
    this.message = message; // Response message
    this.success = statusCode < 400; // Success flag (true for status codes below 400)
  }
}

module.exports = ApiResponse;
