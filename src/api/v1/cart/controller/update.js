// Import necessary modules and utilities
const Cart = require("../../../../models/Cart.model/Cart.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Controller to handle updating the quantity of a product in the user's cart
const updateAddTOCartController = asyncHandler(async (req, res) => {
  // Extract user ID from the request object
  const userId = req.user.userId;
  // Extract product ID from the request parameters
  const { productId } = req.params;
  // Extract the new quantity from the request body
  const { quantity } = req.body;

  // Find the user's cart in the database
  const cart = await Cart.findOne({ userId });

  // Check if the cart has items
  if (!cart.items.length) {
    // If no items are found in the cart, throw an error
    throw new ApiError(404, "Cart not found for this user");
  }

  // Find the index of the item in the cart that matches the provided product ID
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex === -1) {
    // If the product is not found in the cart, throw an error
    throw new ApiError(404, "Product not found in cart");
  }

  // Update the quantity of the found item
  cart.items[itemIndex].quantity = quantity;
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
      rel: "empty_cart",
      href: `${host}/carts/empty`,
      method: "DELETE",
      description: "Empty the cart",
    },
    {
      rel: "remove_item",
      href: `${host}/carts`,
      method: "DELETE",
      description: "Remove this item from the cart using body id",
    },
    {
      rel: "update_quantity",
      href: `${host}/carts`,
      method: "PATCH",
      description: "Update the quantity of this item in the cart using body id",
    },
  ];

  // Return a success response with the updated cart
  return res
    .status(200)
    .json(new ApiResponse(200, { cart, links }, "Cart updated successfully"));
});

// Export the controller to be used in other parts of the application
module.exports = updateAddTOCartController;
