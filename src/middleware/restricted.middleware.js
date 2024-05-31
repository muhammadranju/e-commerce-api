const ApiError = require("../utils/ApiError");

const restricted = (...roles) => {
  // If no roles are provided, throw an error
  if (roles.length === 0) {
    throw new ApiError(401, "Must provide at least one role");
  }
  return (req, res, next) => {
    // If the user is not authenticated, throw an error
    console.log(req.seller);
    console.log(roles);

    // if (!req.user || !req.seller) {
    //   throw new ApiError(401, "Unauthorized access to this resource");
    // }
    // If the user is authenticated, but is not an admin, throw an error
    if (roles.includes(req.user.role) || roles.includes(req.seller.role)) {
      throw new ApiError(403, "You don't have permission to access");
    }
    // If the user is authenticated and is an admin, continue with the request
    return next();
  };
};

module.exports = restricted;
