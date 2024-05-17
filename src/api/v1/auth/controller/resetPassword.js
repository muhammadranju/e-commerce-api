const crypto = require("crypto");

const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const getUserByResetToken = async ({ value }) => {
  // Find a user with the provided reset token
  return await User.findOne({
    forgotPasswordToken: value,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
};

const resetPasswordController = asyncHandler(async (req, res) => {
  // check user email reset link is expired or not
  // if user email reset link is expired return "Your email reset link is expired."
  // get password from frontend or req.body (newPassword, newPasswordTow)

  // Get new password from the request body
  const { newPassword } = req.body;

  // Get reset token from params
  const { resetToken } = req.params;

  // Check if the new password is empty or invalid
  if (!newPassword) {
    throw new ApiError(400, "Please enter a password.");
  }

  // Create hashed token from the reset token
  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Get user using the reset token
  const user = await getUserByResetToken({ value: hashedToken });

  // Check if the reset token is invalid or expired
  if (!user) {
    throw new ApiError(409, "Invalid or expired reset token.");
  }

  // Set a new password in the database with a new hashed password
  user.password = newPassword;
  user.forgotPasswordToken = null;
  user.forgotPasswordExpiry = null;

  // Save the user to the database
  await user.save();

  // HATEOAS links
  const host = req.apiHost;
  const links = [
    {
      rel: "login",
      href: `${host}/auth/login`,
      method: "POST",
      description: "Login",
    },
  ];
  // Respond with success message
  return res
    .status(200)
    .json(new ApiResponse(200, { links }, "Password was change successfully."));
});

module.exports = resetPasswordController;
