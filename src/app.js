const express = require("express");
const app = express();

const globalPage = require("../controller/home.controller");

const middleware = require("./app/middleware");
const routes = require("./routes");

app.use(middleware); // middleware
app.use(routes); // routes

app.use([globalPage.notFoundErrorHandler, globalPage.serverErrorHandler]);

module.exports = app;
