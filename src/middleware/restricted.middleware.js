const ApiError = require("../utils/ApiError");

const restricted = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError("You don't have permission to access", 403);
    }
    next();
  };
};

module.exports = restricted;
