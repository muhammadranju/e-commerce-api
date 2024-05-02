/**
 * This module exports the controller functions for the user API.
 *
 * Each controller function is responsible for handling a specific
 * request/response cycle and performs some action or other with the data
 * received in the request and sends the appropriate response.
 *
 * The functions in this module are:
 * - findSingle: Handles the "GET /api/v1/user/profile" request, retrieves
 *   the user profile of the authenticated user.
 * - update: Handles the "PATCH /api/v1/user/profile" request, updates the
 *   user profile of the authenticated user.
 * - changePassword: Handles the "POST /api/v1/user/change-password" request,
 *   changes the password of the authenticated user.
 */
const findSingle = require("./findSingle");
const update = require("./update");
const changePassword = require("./changePassword");

module.exports = {
  findSingle,
  update,
  changePassword,
};
