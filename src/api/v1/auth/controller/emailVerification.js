const crypto = require("crypto");
const { UserStatusEnum, VerifyStatus } = require("../../../../constants");
const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const userEmailVerify = async ({ value }) => {
  // Find a user with the provided email verification token
  const user = await User.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  // Use a more secure method to find the user, such as User.findByIdAndValidate
  const validatedUser = await User.findById(user._id);

  return validatedUser;
};
const emailVerificationController = asyncHandler(async (req, res, next) => {
  // Get verification token from params
  const { verificationToken } = req.params;

  // Check if verification token is missing
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }

  // Create hashed token from the verification token
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Get user using the verification token
  const user = await userEmailVerify({ value: hashedToken });

  // Check if the user is valid
  if (!user) {
    throw new ApiResponse(409, {}, "Token is invalid or expired");
  }
  // Update the user's email verification status and approval status
  // Now we can remove the associated email token and expiry date as we no  longer need them
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = VerifyStatus.VERIFY;
  user.status = UserStatusEnum.APPROVED;

  // Save the user to the database (validateBeforeSave is set to false)
  await user.save({ validateBeforeSave: false });

  // Respond with success message

  return res
    .status(200)
    .json(
      new ApiResponse(200, { message: true }, "Successfully email verified.✅")
    );
});

module.exports = emailVerificationController;
