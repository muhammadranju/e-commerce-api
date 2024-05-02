const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const getController = asyncHandler(async (req, res) => {
  // get user from database using user id
  const user = await User.findById({ _id: req.user?.userId }).select(
    "-password -accessToken -isEmailVerify -status"
  );

  // check user is found or not in case it work
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user data get successfully."));
});

module.exports = getController;
