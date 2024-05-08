const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const deleteAllAddTOCartController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found for this user");
  }
  cart.items = [];
  await cart.save();
  return res.json(new ApiResponse(200, cart, "Cart emptied successfully"));
});

module.exports = deleteAllAddTOCartController;
