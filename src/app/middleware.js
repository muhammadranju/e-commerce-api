const express = require("express");
const morgan = require("morgan"); // Middleware for logging HTTP requests
const compression = require("compression"); // Middleware for compressing HTTP responses
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies

// const rateLimit = require("../utils/rateLimit.utils/rateLimit.utils");
// const userAgent = require("../middleware/userAgent.middleware");

const middleware = [
  express.json({ limit: "16kb" }), // Middleware for parsing JSON request bodies with a size limit of 16kb
  express.urlencoded({ extended: true, limit: "16kb" }), // Middleware for parsing URL-encoded request bodies with a size limit of 16kb
  compression(), // Middleware for compressing HTTP responses
  cookieParser(), // Middleware for parsing cookies
  morgan("dev"), // Morgan middleware for logging HTTP requests in the 'dev' format

  // userAgent, // Custom middleware for parsing and handling user agents (commented out)
  // rateLimit, // Custom middleware for rate limiting requests (commented out)
];

module.exports = middleware;
