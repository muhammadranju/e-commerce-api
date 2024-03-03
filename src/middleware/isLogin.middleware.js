const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

const isLoginMiddleware = (req, res, next) => {
  try {
    // get token from headers or cookies
    let token = req.headers?.authorization || req.cookies?.access_token;

    // here split bearer token
    token = token?.split(" ")[1];

    // token verify using jwt.verify method
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // check user is login or not
    if (user?.status) {
      return res.status(403).json(
        // return a message
        new ApiResponse(403, "You don't visit login/register page Return home")
      );
    }

    return next();
  } catch (error) {
    if (error.message === "jwt must be provided") {
      return next();
    }

    if (error.message.includes("invalid token")) {
      return res.status(403).json({
        error: "you don't have access to change it.",
        message: error.message,
      });
    }

    if (error.message.includes("invalid signature")) {
      return res.status(403).json({
        error: "you don't have access to change it.",
        message: error.message,
      });
    }

    if (error.message.includes("Unexpected", "token", "end", "input")) {
      return res.status(403).json({
        error: "you don't have access to change it.",
        message: error.message,
      });
    }

    if (error.message.includes("jwt malformed")) {
      return res.status(403).json({
        error: "you don't have access to change it.",
        message: error.message,
      });
    }

    if (error.message.includes("jwt expired")) {
      return next();
    }

    return next(error);
  }
};

module.exports = isLoginMiddleware;
