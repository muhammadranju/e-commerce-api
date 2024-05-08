const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const findAddTOCartController = asyncHandler(async (req, res) => {
  // Get userId from request
  const userId = req.user.userId;

  // Find the cart using userId
  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "product_uid"
  ); // Assuming product details are populated

  // Check if cart exists and throw an error if not
  if (!cart.items.length) {
    throw new ApiError(404, "Cart not found for this user");
  }

  // Return the cart to the user (including populated product details)
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

module.exports = findAddTOCartController;
