// Importing required models and utilities
const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Controller to handle deleting all items from the cart
const deleteAllAddTOCartController = asyncHandler(async (req, res) => {
  // Extract userId from the request object
  const userId = req.user.userId;

  // Find the cart associated with the userId
  const cart = await Cart.findOne({ userId });
  // If no cart is found, throw an error
  if (!cart) {
    throw new ApiError(404, "Cart not found for this user");
  }

  // Empty the cart by setting items array to empty
  cart.items = [];
  // Save the updated cart
  await cart.save();

  // Extract API host from the request object
  const host = req.apiHost;
  // HATEOAS links for better API navigation
  const links = [
    {
      rel: "self",
      href: `${host}/carts`,
      method: "GET",
      description: "View your cart",
    },
    {
      rel: "add_to_cart",
      href: `${host}/carts`,
      method: "POST",
      description: "Add item to cart",
    },
    {
      rel: "empty_cart",
      href: `${host}/carts/empty`,
      method: "DELETE",
      description: "Empty the cart",
    },
  ];

  // Send response with status 200 and the updated cart along with HATEOAS links
  return res
    .status(200)
    .json(new ApiResponse(200, { cart, links }, "Cart emptied successfully"));
});

// Export the controller
module.exports = deleteAllAddTOCartController;
