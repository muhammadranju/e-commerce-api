const { ApiVersion } = require("../../../../../constants");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const {
  sendEmail,
  emailVerificationMailgenContent,
} = require("../../../../../services/emailSend.service");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const forgotPasswordController = asyncHandler(async (req, res) => {
  // Extract seller's email from the frontend or request body
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  // Check if the seller's email exists in the database
  const seller = await Seller.findOne({ email });

  // If the seller is not found, throw an error message "Seller Not found"
  if (!seller) {
    throw new ApiError(400, "Seller Not found");
  }
  // This error message indicates that the provided email is not associated with any seller account
  // Generate a temporary token and save it into the database
  const { unHashedToken, hashedToken, tokenExpiry } =
    seller.generateTemporaryToken();

  // This token will be used to verify the seller's identity during the password reset process
  seller.forgotPasswordToken = hashedToken;
  seller.forgotPasswordExpiry = tokenExpiry;

  await seller.save({ validateBeforeSave: false });
  // If all checks pass:
  // - Send a verification email to the seller's email address
  // - This email contains instructions and a link to reset the seller's password
  sendEmail({
    email: seller?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      `${seller?.name}`,
      `${req.protocol}://${req.get(
        "host"
      )}${ApiVersion}/seller/auth/reset-password/${unHashedToken}`
    ),
  });

  // Return a response confirming that the password reset email has been sent to the seller's email address
  // This response informs the seller about the action taken and prompts them to check their email for further instructions
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: seller?.email },
        "Password reset mail has been sent on your mail id"
      )
    );
});

module.exports = forgotPasswordController;
