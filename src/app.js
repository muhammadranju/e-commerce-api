const express = require("express");
const app = express();

const globalPage = require("./controller/common.controller/common.controller");

const middleware = require("./app/middleware");
const routes = require("./routes");

app.use(middleware); // middleware
app.use(routes); // routes

app.use([globalPage.notFoundHandler, globalPage.errorHandler]);

module.exports = app;
