const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const changePasswordController = asyncHandler(async (req, res) => {
  // check user email reset link is expired or not
  // if user email reset link is expired return "Your email reset link is expired."
  // get password from frontend or req.body (newPassword, newPasswordTow)
  // get all password in from frontend or req.body
  const { password, newPassword, conformPassword } = req.body;

  if ((!password, !newPassword, !conformPassword)) {
    throw new ApiError(
      400,
      "You must be provide New password and Conform password"
    );
  }
  // check newPassword and conformPassword is match or not
  if (newPassword !== conformPassword) {
    throw new ApiError(400, "Password or Conform Password don't match.");
  }

  console.log("change password", req.user);
  // find user on database by userId
  const user = await User.findById({ _id: req.user.userId });

  // check user password and database password is match or not
  const isMatch = await user.compareBcryptPassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Password don't match.");
  }

  // save to old password to new password
  user.password = newPassword;
  await user.save(); // save to database

  return res
    .status(200)
    .json(
      new ApiResponse(
        203,
        { yourEmail: user.email },
        "Password was change successfully."
      )
    );
});

module.exports = changePasswordController;
