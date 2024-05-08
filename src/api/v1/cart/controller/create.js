const Cart = require("../../../../models/Cart.model/Cart.model");
const Product = require("../../../../models/Products.model/Products.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const createAddTOCartController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new ApiError(400, "Missing required fields: productId and quantity");
  }
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
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

  return res.status(201).json(new ApiResponse(201, cart, "Item added to cart"));
});

module.exports = createAddTOCartController;
