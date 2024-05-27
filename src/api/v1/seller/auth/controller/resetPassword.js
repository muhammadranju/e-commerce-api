const crypto = require("crypto");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const asyncHandler = require("../../../../../utils/asyncHandler");

// this function will return password hash token and match from database
const getSellerByResetToken = async ({ value }) => {
  // Find a seller with the provided reset token
  return await Seller.findOne({
    forgotPasswordToken: value,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
};
const resetPasswordSellerController = asyncHandler(async (req, res) => {
  // Check if the seller's email reset link is valid, invalid, or expired
  // If the reset link is expired, throw an error message "User email reset link is expired."
  // This error message indicates that the link provided for resetting the password has expired

  // Extract the new password from the frontend or request body
  const { newPassword } = req.body;
  // Retrieve the reset token from the request parameters
  const { resetToken } = req.params;

  // Check if the new password provided by the seller is empty or invalid
  // Ensure that the seller provides a valid and non-empty password for resetting
  if (!newPassword) {
    throw new ApiError(400, "Please enter a password.");
  }

  // Create a hashed token using the crypto package
  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Hashing the token adds an additional layer of security to the reset process
  // Retrieve the seller's information using the password verify function
  const seller = await getSellerByResetToken({ value: hashedToken });
  // This step verifies the seller's identity based on the provided token
  // Check if the seller token is invalid or expired
  // If the token is expired, throw an error message "Token is invalid or expired."
  if (!seller) {
    throw new ApiError(409, "Invalid or expired reset token.");
  }

  // This error message indicates that the token provided for resetting the password is no longer valid
  seller.password = newPassword;
  seller.forgotPasswordToken = undefined;
  seller.forgotPasswordExpiry = undefined;

  // If all checks pass:
  // - Set the new password in the database with the newly hashed password
  // - Update the seller's password to the newly provided one
  await seller.save();

  const host = req.myHost;
  // HATEOAS links
  const links = [
    {
      rel: "login",
      href: `${host}/seller/auth/login`,
      method: "POST",
      description: "Login with new password",
    },
  ];

  // Return a response confirming the successful password change
  // This response informs the seller that their password has been successfully updated
  return res
    .status(200)
    .json(new ApiResponse(200, { links }, "Password was change successfully."));
});

module.exports = resetPasswordSellerController;
