const Order = require("../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const findOrderController = asyncHandler(async (req, res) => {
  // Get userId from request
  const userId = req.user.userId;

  // Find the cart using userId
  const orders = await Order.find({ user: userId })
    .populate({ path: "items", populate: "product" })
    .populate("user")
    .populate("shippingAddressId");
  // Assuming product details are populated

  // Check if cart exists and throw an error if not
  if (!orders.length) {
    throw new ApiError(404, "Orders not found for this user");
  }

  // Return the cart to the user (including populated product details)
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

module.exports = findOrderController;
