const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const deleteAddTOCartController = asyncHandler(async (req, res) => {
  // Extract productId from request parameters
  const { productId } = req.params;
  // Extract userId from authenticated user's information
  const userId = req.user.userId;

  // Find the user's cart by userId
  const cart = await Cart.findOne({ userId });

  // If the cart is empty or not found, throw a 404 error
  if (!cart.items.length) {
    throw new ApiError(404, "Cart not found for this user");
  }

  // Find the index of the item to be removed using the productId
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  // If the item is not found in the cart, throw a 404 error
  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Remove the item from the cart using splice
  cart.items.splice(itemIndex, 1);
  // Save the updated cart to the database
  await cart.save();

  const host = req.apiHost;
  // HATEOAS links
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
      rel: "remove_from_cart",
      href: `${host}/carts`,
      method: "DELETE",
      description: "Remove item from cart",
    },
  ];
  // Return a success response with the updated cart
  return res.json(
    new ApiResponse(200, { cart, links }, "Item removed from cart")
  );
});

module.exports = deleteAddTOCartController;
