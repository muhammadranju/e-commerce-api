const crypto = require("crypto");
const {
  UserStatusEnum,
  VerifyStatus,
  ApiVersion,
} = require("../../../../constants");
const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const userEmailVerify = async ({ value }) => {
  // Find a user with the provided email verification token
  return await await User.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });
};

const emailVerificationController = asyncHandler(async (req, res) => {
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
    throw new ApiError(409, {
      error: "Token is invalid or expired",
      rel: "login",
      href: `${req.myHost}${ApiVersion}/auth/login`,
      method: "POST",
      description: "Login",
    });
  }
  // Update the user's email verification status and approval status
  // Now we can remove the associated email token and expiry date as we no  longer need them
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = VerifyStatus.VERIFY;
  user.status = UserStatusEnum.APPROVED;

  // Save the user to the database (validateBeforeSave is set to false)
  await user.save({ validateBeforeSave: false });

  // HATEOAS links
  const links = [
    {
      rel: "login",
      href: `${req.myHost}${ApiVersion}/auth/login`,
      method: "POST",
      description: "Login",
    },
    // Add more links as needed
  ];
  // Respond with success message to the user that their email has been successfully verified and they can proceed with using the platform now
  return res
    .status(200)
    .json(new ApiResponse(200, { links }, "Successfully email verified."));
});

module.exports = emailVerificationController;
