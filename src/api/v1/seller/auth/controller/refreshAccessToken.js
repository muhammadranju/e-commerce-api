const jwt = require("jsonwebtoken");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

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
      "Something went wrong while generating refresh and access token",
      error
    );
  }
};

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
      // eslint-disable-next-line no-undef
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

module.exports = refreshAccessToken;
