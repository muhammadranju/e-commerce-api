const Seller = require("../../models/Seller.model/Seller.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

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
const signupSellerPostController = asyncHandler(async (req, res) => {
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
});

// seller login post controller
const loginSellerPostController = asyncHandler(async (req, res) => {
  // Extract data from the frontend or request body
  const { email, password } = req.body;

  // Validate the received data for correctness
  // This step could involve checking for required fields and data formats
  // It ensures that the received data is properly structured and conforms to expectations
  // Ensure that the seller's password meets the minimum length requirement (e.g., minimum 8 characters)
  // This check ensures that the password meets security standards before proceeding with authentication
  // Search for the email in the database to verify if it exists
  // This step queries the database to find if the provided email exists in the records
  // If the email is not found in the database, throw an error message "Invalid credentials, email or password."
  // This error message indicates that either the email provided is not registered or the combination of email and password is incorrect
  // Compare the password provided by the seller with the stored password in the database
  // This step involves verifying the password provided by the user against the hashed password stored in the database
  // If the password matches:
  // - Generate a seller access_token and save it into cookies for authentication
  // - This access_token is typically a secure token used for subsequent authenticated requests
  // - Storing it in cookies ensures persistence across requests and sessions
  // Return the response
  // This response could include a success message or any relevant data indicating a successful login
});

// forgot password post controller
const forgotPasswordSellerPostController = asyncHandler(async (req, res) => {
  // Extract seller's email from the frontend or request body
  const { email } = req.body;

  // Check if the seller's email exists in the database
  // If the seller is not found, throw an error message "Seller Not found"
  // This error message indicates that the provided email is not associated with any seller account
  // Generate a temporary token and save it into the database
  // This token will be used to verify the seller's identity during the password reset process
  // If all checks pass:
  // - Send a verification email to the seller's email address
  // - This email contains instructions and a link to reset the seller's password
  // Return a response confirming that the password reset email has been sent to the seller's email address
  // This response informs the seller about the action taken and prompts them to check their email for further instructions
});

// reset password post controller
const resetPasswordSellerPostController = asyncHandler(async (req, res) => {
  // Check if the seller's email reset link is valid, invalid, or expired
  // If the reset link is expired, throw an error message "User email reset link is expired."
  // This error message indicates that the link provided for resetting the password has expired
  // Extract the new password from the frontend or request body
  // Retrieve the reset token from the request parameters
  // Check if the new password provided by the seller is empty or invalid
  // Ensure that the seller provides a valid and non-empty password for resetting
  // Create a hashed token using the crypto package
  // Hashing the token adds an additional layer of security to the reset process
  // Retrieve the seller's information using the password verify function
  // This step verifies the seller's identity based on the provided token
  // Check if the seller token is invalid or expired
  // If the token is expired, throw an error message "Token is invalid or expired."
  // This error message indicates that the token provided for resetting the password is no longer valid
  // If all checks pass:
  // - Set the new password in the database with the newly hashed password
  // - Update the seller's password to the newly provided one
  // Return a response confirming the successful password change
  // This response informs the seller that their password has been successfully updated
});

// seller email verification  post controller
const emailVerificationSellerPostController = asyncHandler(async (req, res) => {
  // Extract the verification token from the request body or parameters
  // The verification token is essential for confirming the authenticity of the seller's email address
  // Verify the provided verification token
  // This step ensures that the token is valid and has not been tampered with during transmission
  // Retrieve the seller associated with the verification token from the database
  // This query fetches the seller's information based on the verified token
  // Check if the seller exists and if their email is already verified
  // This verification ensures that the seller exists in the database and their email has not been previously verified
  // If the seller exists and their email is not yet verified:
  // - Update the seller's email verification status to "verified" in the database
  // - This action marks the seller's email as verified, enabling access to additional features
  // Return a response indicating the successful email verification
  // This response informs the seller that their email has been successfully verified and they can proceed with using the platform
});

// seller logout post controller
const logoutSellerPostController = asyncHandler(async (req, res) => {
  // Perform any necessary cleanup tasks or actions related to seller logout
  // This controller handles the logic for logging out a seller from the system
  // Clear any authentication tokens or session data associated with the seller
  // This step ensures that the seller's authentication state is invalidated upon logout
  // Return a response confirming successful logout
  // This response indicates that the seller has been successfully logged out of the system
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
  signupSellerPostController,
  loginSellerPostController,
  forgotPasswordSellerPostController,
  resetPasswordSellerPostController,
  emailVerificationSellerPostController,
  logoutSellerPostController,
  refreshAccessToken,
};
