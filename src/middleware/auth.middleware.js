const User = require("../models/User.model/User.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// Middleware function for user authentication
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from headers or cookies
    let token =
      req.headers?.authorization?.split(" ")[1] || req.cookies?.access_token;

    // Check if token is provided
    if (!token) {
      // If token is not provided, throw an unauthorized error
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // here split bearer token
    // token = token?.split(" ")[1] ?? token;

    // Verify JWT token and extract user ID
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // check user is valid or invalid
    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // Find user by user ID
    const user = await User.findOne({ _id: decodedToken.user_id });

    // Check if user exists
    if (!user) {
      // If user is not found, throw an unauthorized error
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // Set user payload to req.user for use in subsequent middleware
    req.user = {
      userId: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerify: user.isEmailVerify,
      status: user.status,
    };

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Pass any caught errors to the error handling middleware
    next(error);
    // throw new ApiError(401, "Unauthorized invalid access", [error]);
  }
};

module.exports = authMiddleware;
