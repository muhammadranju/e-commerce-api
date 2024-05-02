const signup = require("./signup");
const resetPassword = require("./resetPassword");
const login = require("./login");
const logout = require("./logout");
const forgotPassword = require("./forgotPassword");
const emailVerification = require("./emailVerification");
const refreshAccessToken = require("./refreshAccessToken");

module.exports = {
  signup,
  resetPassword,
  login,
  forgotPassword,
  logout,
  emailVerification,
  refreshAccessToken,
};
