const crypto = require("crypto");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const asyncHandler = require("../../../../../utils/asyncHandler");
const { VerifyStatus, UserStatusEnum } = require("../../../../../constants");

const sellerEmailVerify = async ({ value }) => {
  // Find a seller with the provided email verification token
  return await Seller.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });
};
const emailVerificationController = asyncHandler(async (req, res) => {
  // Extract the verification token from the request body or parameters
  const { verificationToken } = req.params;
  // The verification token is essential for confirming the authenticity of the seller's email address
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }
  // Verify the provided verification token
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // This step ensures that the token is valid and has not been tampered with during transmission
  // Retrieve the seller associated with the verification token from the database
  const seller = await sellerEmailVerify({ value: hashedToken });
  // This query fetches the seller's information based on the verified token
  // Check if the seller exists and if their email is already verified
  if (!seller) {
    throw new ApiResponse(409, {}, "Token is invalid or expired");
  }
  // This verification ensures that the seller exists in the database and their email has not been previously verified
  // If the seller exists and their email is not yet verified:
  seller.emailVerificationToken = undefined;
  seller.emailVerificationExpiry = undefined;
  seller.isEmailVerified = VerifyStatus.VERIFY;
  seller.status = UserStatusEnum.APPROVED;
  // - Update the seller's email verification status to "verified" in the database
  // - This action marks the seller's email as verified, enabling access to additional features
  await seller.save({ validateBeforeSave: false });

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "login",
      href: `${host}/seller/auth/login`,
      method: "POST",
      description: "Login seller",
    },
  ];

  // Return a response indicating the successful email verification
  // This response informs the seller that their email has been successfully verified and they can proceed with using the platform
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: true, links },
        "Successfully email verified.✅"
      )
    );
});

module.exports = emailVerificationController;
