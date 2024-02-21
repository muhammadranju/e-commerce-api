const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");

// const rateLimit = require("../utils/rateLimit.utils/rateLimit.utils");
// const userAgent = require("../middleware/userAgent.middleware");

const middleware = [
  express.json({ limit: "16kb" }),
  express.urlencoded({ extended: true, limit: "16kb" }),
  compression(),
  cookieParser(),
  // userAgent,
  morgan("dev"),
  // rateLimit,
];

module.exports = middleware;
