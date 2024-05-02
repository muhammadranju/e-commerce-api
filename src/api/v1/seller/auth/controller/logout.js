const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const logoutController = asyncHandler(async (req, res) => {
  // Perform any necessary cleanup tasks or actions related to seller logout
  // This controller handles the logic for logging out a seller from the system
  // Clear any authentication tokens or session data associated with the seller
  // This step ensures that the seller's authentication state is invalidated upon logout
  // Return a response confirming successful logout
  // This response indicates that the seller has been successfully logged out of the system

  res.clearCookie("seller_token", { expires: new Date(0) });

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
