const Wishlist = require("../../../../models/Wishlist.model/Wishlist.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const createWishlistController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId || req.body.userId;
  // Check if item already exists in wishlist

  if (!productId || !userId) {
    throw new ApiError(400, "Product id is required");
  }

  let existingWishlist = await Wishlist.findOne({ user: userId });

  if (
    existingWishlist &&
    existingWishlist.products.find((item) => item.equals(productId))
  ) {
    throw new ApiError(400, "Item already exists in wishlist");
  }

  let wishlist;
  if (existingWishlist) {
    wishlist = existingWishlist;
    wishlist.products.push(productId);
  } else {
    wishlist = new Wishlist({ user: userId, products: [productId] });
  }
  console.log(req.user.userId);

  await wishlist.save();
  return res
    .status(201)
    .json(
      new ApiResponse(201, wishlist, "Item added to wishlist successfully")
    );
});

module.exports = createWishlistController;
