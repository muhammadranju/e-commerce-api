const jwt = require("jsonwebtoken");
const User = require("../models/User.model/User.model");
const Seller = require("../models/Seller.model/Seller.model");
const ApiError = require("../utils/ApiError");

const config = require("../config/config");
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
    const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

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
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
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

const sellerAuthMiddleware = async (req, res, next) => {
  try {
    // Extract token from headers or cookies
    let token =
      req.headers?.authorization?.split(" ")[1] || req.cookies?.seller_token;

    // Check if token is provided
    if (!token) {
      // If token is not provided, throw an unauthorized error
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // here split bearer token
    // token = token?.split(" ")[1] ?? token;

    // Verify JWT token and extract seller ID
    const decodedToken = jwt.verify(token, config.SELLER_ACCESS_TOKEN_SECRET);

    // check seller is valid or invalid
    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // Find seller by seller ID
    const seller = await Seller.findOne({ _id: decodedToken.seller_id });

    // Check if seller exists
    if (!seller) {
      // If seller is not found, throw an unauthorized error
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // Set seller payload to req.seller for use in subsequent middleware
    req.seller = {
      sellerId: seller._id,
      phoneNumber: seller.phoneNumber,
      name: seller.name,
      isEmailVerified: seller.isEmailVerified,
      role: seller.role,
      status: seller.status,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, sellerAuthMiddleware };
