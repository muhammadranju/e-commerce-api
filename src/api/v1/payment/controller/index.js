const create = require("./createPayment");
const success = require("./successPayment");
const failed = require("./failedPayment");
const cancel = require("./cancelPayment");
const ipn = require("./ipnPayment");

module.exports = { create, success, failed, cancel, ipn };
