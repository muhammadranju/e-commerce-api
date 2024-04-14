const slugify = require("slugify");
const randomstring = require("randomstring");
const emailValidator = require("email-validator");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const Seller = require("../../models/Seller.model/Seller.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const customEmailValidator = require("../../services/emailValidator.service");
const {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} = require("../../services/emailSend.service");
const { ApiVersion, VerifyStatus, UserStatusEnum } = require("../../constants");

// this function will return email hash token and match from database
/**
 * Finds a seller with the provided email verification token.
 * Checks that the token is not expired.
 * @param {Object} value - Object containing the email verification token.
 * @returns {Promise<Seller>} Promise resolving to Seller model instance if found and valid.
 */
const sellerEmailVerify = async ({ value }) => {
  // Find a seller with the provided email verification token
  return await Seller.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });
};
// this function will return password hash token and match from database
const getSellerByResetToken = async ({ value }) => {
  // Find a seller with the provided reset token
  return await Seller.findOne({
    forgotPasswordToken: value,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
};

/**
 * Generates new access and refresh tokens for the provided user ID.
 *
 * Retrieves the seller document for the given ID.
 * Generates a new access token and refresh token for the seller.
 * Saves the new refresh token to the seller document.
 *
 * Returns an object containing the new accessToken and refreshToken.
 *
 * Throws ApiError if an error occurs during token generation.
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Retrieve seller information based on the provided user ID
    const seller = await Seller.findById(userId);

    // Generate an access token for the seller
    const accessToken = seller.generateAccessToken();

    // Generate a refresh token for the seller
    const refreshToken = seller.generateRefreshToken();

    // Update the seller's refresh token in the database
    // This step ensures that the latest refresh token is stored for future use
    seller.refreshToken = refreshToken;
    await seller.save({ validateBeforeSave: false });

    // Return the generated access and refresh tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // If an error occurs during token generation, throw a server error
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// seller signup post controller
/**
 * Signs up a new seller.
 *
 * Validates the request body, checking for required fields and valid email.
 * Checks if email already exists.
 * If valid, generates temporary token, saves to database, sends verification email.
 * Returns API response with seller data if successful.
 * Throws ApiError on validation errors or email exists.
 */
const signupSellerController = asyncHandler(async (req, res) => {
  // Extract data from the frontend or request body
  // Validate the received data for correctness
  // Ensure that the user's password meets the minimum length requirement (e.g., minimum 8 characters)
  // Check if the provided email already exists in the database
  // If the email already exists, throw an error message "This email already exists."
  // If the email does not exist:
  // - Generate a temporary token for verification
  // - Store the temporary token in the database
  // If all checks pass:
  // - Send a verification email to the user's email address
  // If the email does not exist and all data is valid:
  // - Save all the received data into the database

  const {
    name,
    email,
    password,
    shopName,
    shopDescription,
    phoneNumber,
    shopAddress,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !shopName ||
    !shopDescription ||
    !phoneNumber ||
    !shopAddress
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password minimum 8 characters.");
  }

  const shopUrlLink = `${slugify(shopName)}${randomstring.generate(12)}`;

  function validateEmail(email) {
    return emailValidator.validate(email) && customEmailValidator(email);
  }

  if (!validateEmail(email)) {
    throw new ApiError(
      400,
      "Invalid email format only accept top level  mail."
    );
  }

  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new ApiError(400, "You have an already account.");
  }

  const seller = new Seller({
    name,
    sellerUID: uuidv4(),
    email,
    password,
    shopName,
    shopUrlLink,
    shopDescription,
    phoneNumber,
    shopAddress,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    seller.generateTemporaryToken();

  seller.emailVerificationToken = hashedToken;
  seller.emailVerificationExpiry = tokenExpiry;

  await seller.save();

  // Send an email for email verification
  sendEmail({
    email: seller?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      `${seller?.name}`,
      `${req.protocol}://${req.get(
        "host"
      )}${ApiVersion}/seller/auth/verify-email/${unHashedToken}`
    ),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, seller, "Seller account created successfully."));
});

// seller login post controller
const loginSellerController = asyncHandler(async (req, res) => {
  // Extract data from the frontend or request body
  const { email, phoneNumber, password } = req.body;

  // Validate the received data for correctness
  // This step could involve checking for required fields and data formats
  // It ensures that the received data is properly structured and conforms to expectations
  if (!email || !password) {
    throw new ApiError(400, "Email and password required.");
  }

  // Search for the email in the database to verify if it exists
  // This step queries the database to find if the provided email exists in the records
  const seller = await Seller.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    seller.generateTemporaryToken();

  seller.emailVerificationToken = hashedToken;
  seller.emailVerificationExpiry = tokenExpiry;

  // If the email is not found in the database, throw an error message "Invalid credentials, email or password."
  // This error message indicates that either the email provided is not registered or the combination of email and password is incorrect
  if (!seller) {
    throw new ApiError(400, "Invalid credentials.");
  }

  if (!seller.isEmailVerified) {
    await seller.save();
    sendEmail({
      email: seller.email,
      subject: "Email Verification Reminder",
      mailgenContent: emailVerificationMailgenContent(
        `${seller?.name}`,
        `${req.protocol}://${req.get(
          "host"
        )}${ApiVersion}/seller/auth/verify-email/${unHashedToken}`
      ),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Your account is not verified. we've sent email verification reminder sent. please check your email."
        )
      );
  }

  // Compare the password provided by the seller with the stored password in the database
  // This step involves verifying the password provided by the user against the hashed password stored in the database
  const comparePassword = await seller.compareBcryptPassword(password);
  if (!comparePassword) {
    throw new ApiError(400, "Invalid credentials, email or password.");
  }

  // If the password matches:
  // - Generate a seller access_token and save it into cookies for authentication
  // - This access_token is typically a secure token used for subsequent authenticated requests
  // - Storing it in cookies ensures persistence across requests and sessions
  const token = await seller.generateAccessToken();
  res.cookie("seller_token", token, {
    maxAge: 60 * 60 * 24 * 1 * 1000, //30 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
  });

  // Return the response
  // This response could include a success message or any relevant data indicating a successful login
  return res
    .status(200)
    .json(
      new ApiResponse(200, { token }, "Seller logging in account successfully.")
    );
});

// forgot password post controller
const forgotPasswordSellerController = asyncHandler(async (req, res) => {
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

// reset password post controller
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

  // Return a response confirming the successful password change
  // This response informs the seller that their password has been successfully updated
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password was change successfully."));
});

// seller email verification  post controller
const emailVerificationSellerController = asyncHandler(async (req, res) => {
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
  // Return a response indicating the successful email verification
  // This response informs the seller that their email has been successfully verified and they can proceed with using the platform
  return res
    .status(200)
    .json(
      new ApiResponse(200, { message: true }, "Successfully email verified.✅")
    );
});

// seller logout post controller
const logoutSellerController = asyncHandler(async (req, res) => {
  // Perform any necessary cleanup tasks or actions related to seller logout
  // This controller handles the logic for logging out a seller from the system
  // Clear any authentication tokens or session data associated with the seller
  // This step ensures that the seller's authentication state is invalidated upon logout
  // Return a response confirming successful logout
  // This response indicates that the seller has been successfully logged out of the system

  res.clearCookie("seller_token", { expires: new Date(0) });

  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { content: "204 No Content" },
        "You are now logout successfully."
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // Retrieve the refresh token from cookies or request body
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // Check if a refresh token is provided
    // If not provided, throw an unauthorized request error
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the incoming refresh token
    // Decode the token using the seller's refresh token secret
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.SELLER_REFRESH_TOKEN_SECRET
    );

    // Find the seller associated with the decoded token
    // If no seller found, throw an invalid refresh token error
    const seller = await Seller.findById(decodedToken?._id);
    if (!seller) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Set cookie options for HTTP security

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Generate new access and refresh tokens for the seller
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(seller._id);

    // Set the new access and refresh tokens as cookies in the response
    // Return a JSON response confirming successful token refresh
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    // If an error occurs during token refresh, throw an invalid refresh token error
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

module.exports = {
  signupSellerController,
  loginSellerController,
  forgotPasswordSellerController,
  resetPasswordSellerController,
  emailVerificationSellerController,
  logoutSellerController,
  refreshAccessToken,
};
