const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const deleteAddTOCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId });

  if (!cart.items.length) {
    throw new ApiError(404, "Cart not found for this user");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  return res.json(new ApiResponse(200, cart, "Item removed from cart"));
});

module.exports = deleteAddTOCartController;
