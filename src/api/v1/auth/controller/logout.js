const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const logoutController = asyncHandler(async (req, res, next) => {
  // Clear user cookies from the browser
  res.clearCookie("access_token", { expires: new Date(0) });

  // Respond with a success message for logout
  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { content: "204 No Content" },
        "You are now logout successfully."
      )
    );
});

module.exports = logoutController;
