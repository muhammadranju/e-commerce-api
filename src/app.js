const express = require("express");
const app = express();
const { ApiVersion } = require("./constants");

// Import global controller functions
const {
  controller: { notFount, errorHandler },
} = require("./api/v1/global/");

// Import middleware and routes
const middleware = require("./app/middleware");
const routes = require("./routes");

// Apply middleware
app.use(middleware);

// Apply routes with API version
app.use(ApiVersion, routes);

// Apply global controller functions for handling not found and error cases
app.use([notFount, errorHandler]);

module.exports = app;
