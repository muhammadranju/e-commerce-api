const User = require("../../models/User.model/User.model");
const asyncHandler = require("../../utils/asyncHandler");

const signupPostController = asyncHandler(async (req, res, next) => {
  try {
    res.json({ message: "Hello Bangladesh" });
    // Get user data from req.body frontend side
    // check user data is valid or not
    // if all ok then check database user is already exits or not
    // check username is exits or not
    // if user not exits then check user email is valid or not
    // check user password is equal to condition min 8
    // if all ok then do signup the user
  } catch (error) {
    next(error);
  }
});

const loginPostController = asyncHandler(async (req, res, next) => {
  // Get User data from req.body frontend.
  // check user data is valid or not.
  // check database user email/username & password is valid or not.
  // check user email/username is exits or not.
  // check user password is valid or not.
  // set user access_token to cookies.
  // if all ok then do login the user.
  try {
  } catch (error) {
    next(error);
  }
});

const forgotPasswordPostController = asyncHandler(async (req, res, next) => {
  // Get User Email from frontend side.
  // check user email form database is exits or not.
  // if no user found return "User not found this id."
  // if user is valid then send user email reset link.

  try {
  } catch (error) {
    next(error);
  }
});

const resetPasswordPostController = asyncHandler(async (req, res, next) => {
  try {
    // check user email reset link is expired or not
    // if user email reset link is expired return "Your email reset link is expired."
    // if no user found return "User not found this id."
    // if all ok then reset user password and save to user database user hash password.
  } catch (error) {
    next(error);
  }
});

const logoutPostController = asyncHandler(async (req, res, next) => {
  // clear user cookies from browser
  // if no user found return "User not found this id."
  // then user redirect to login
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = {
  loginPostController,
  signupPostController,
  forgotPasswordPostController,
  resetPasswordPostController,
  logoutPostController,
};
