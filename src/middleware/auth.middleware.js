const User = require("../models/User.model/User.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// Authorization middleware function
const authMiddleware = async (req, res, next) => {
  try {
    // get token from headers or cookies
    let token = req.headers?.authorization || req.cookies?.access_token;

    // check token is valid or invalid
    // if invalid throw error
    if (!token) {
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // here split bearer token
    token = token?.split(" ")[1] ?? token;

    // verify jwt token using jwt.verify and get user id
    const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // check user is valid or invalid
    if (!userId) {
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // find user by given userId
    const user = await User.findById({ _id: userId.user_id });
    // check user is valid or invalid
    if (!user) {
      throw new ApiError(401, "Unauthorized invalid access");
    }

    // set payload for req.user
    const payload = {
      userId: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerify: user.isEmailVerify,
      status: user.status,
    };

    // set user payload to req.user
    req.user = payload;

    // return next() function for next controller
    return next();
  } catch (error) {
    next(error);
    // throw new ApiError(401, "Unauthorized invalid access", [error]);
  }
};

module.exports = authMiddleware;
