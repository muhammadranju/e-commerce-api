// Import required libraries and models
const mongoose = require("mongoose");
const Cart = require("../../../../models/Cart.model/Cart.model");
const Product = require("../../../../models/Products.model/Products.model");
const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Controller function to handle adding items to cart
const createAddTOCartController = asyncHandler(async (req, res) => {
  // Extract userId, productId, and quantity from request body
  const userId = req.user.userId;
  const { productId, quantity = 1 } = req.body;

  // Check if productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid order id. Please provide a valid order id."
    );
  }

  // Check if productId is missing
  if (!productId) {
    throw new ApiError(400, "Missing required fields: productId and quantity");
  }

  // Find the product by productId
  const product = await Product.findById(productId);
  // Find the user by userId
  const user = await User.findById(userId);

  // Throw error if product not found
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find or create cart for the user
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Check if item already exists in the cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    // Update quantity if item exists
    existingItem.quantity += quantity;
  } else {
    // Add cart to user's cart array
    user.carts.push(cart._id);
    // Save the updated user
    await user.save({ validateBeforeSave: false });

    // Add new item to cart
    cart.items.push({
      productId,
      quantity,
      name: product?.title,
      price: product?.regular_price,
      sku: product?.SKU,
    });
  }

  // Save the updated cart
  await cart.save();

  // HATEOAS links
  const links = [
    {
      rel: "view_cart",
      href: `/carts`,
      method: "GET",
      description: "View Cart",
    },
    {
      rel: "checkout",
      href: `/checkout/orders`,
      method: "GET",
      description: "Checkout",
    },
    // Add more links as needed
  ];
  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(201, { cart, links }, "Item added to cart"));
});

module.exports = createAddTOCartController;
