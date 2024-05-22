const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
// Middleware to check if the user is logged in
const isSellerLoginMiddleware = (req, res, next) => {
  try {
    // Get token from headers or cookies
    let token =
      req.headers?.authorization?.split(" ")[1] || req.cookies?.seller_token;

    // Verify the token using jwt.verify method
    const seller = jwt.verify(token, config.SELLER_ACCESS_TOKEN_SECRET);
    // Check if the seller is logged in based on status property

    if (seller?.status) {
      // If seller is logged in, return a 403 Forbidden response
      throw new ApiError(
        403,
        "You don't visit login/register page Return home"
      );
    }

    // Proceed to the next middleware if seller is not logged in
    return next();
  } catch (error) {
    // Handle various error cases
    if (error.message === "jwt must be provided") {
      // If token is not provided, continue to the next middleware
      return next();
    }

    // Handle other error messages related to token validation

    if (error.message.includes("invalid token")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      throw new ApiError(
        403,
        "you don't have access to change it.",
        error.message
      );
    }

    if (error.message.includes("invalid signature")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      throw new ApiError(
        403,
        "you don't have access to change it.",
        error.message
      );
    }

    if (error.message.includes("Unexpected", "token", "end", "input")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      throw new ApiError(
        403,
        "you don't have access to change it.",
        error.message
      );
    }

    if (error.message.includes("jwt malformed")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      throw new ApiError(
        403,
        "you don't have access to change it.",
        error.message
      );
    }

    if (error.message.includes("jwt expired")) {
      // If token is expired, continue to the next middleware
      return next();
    }

    // If none of the above conditions are met, pass the error to the error handling middleware
    return next(error);
  }
};

module.exports = isSellerLoginMiddleware;
