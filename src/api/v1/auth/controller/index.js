const signup = require("./signup");
const login = require("./login");
const forgotPassword = require("./forgotPassword");
const changePassword = require("./changePassword");
const resetPassword = require("./resetPassword");
const emailVerification = require("./emailVerification");
const logout = require("./logout");

/**
 * Exports an object containing various authentication-related functions.
 * @module api/v1/auth/controller
 * @property {function} signup - Function to handle user signup.
 * @property {function} login - Function to handle user login.
 * @property {function} forgotPassword - Function to handle password reset requests.
 * @property {function} changePassword - Function to handle password change requests.
 * @property {function} resetPassword - Function to handle password reset flow.
 * @property {function} emailVerification - Function to handle email verification.
 * @property {function} logout - Function to handle user logout.
 */
module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword,
  resetPassword,
  emailVerification,
  logout,
};
