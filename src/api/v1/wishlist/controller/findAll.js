const Wishlist = require("../../../../models/Wishlist.model/Wishlist.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const getWishlistsController = asyncHandler(async (req, res) => {
  const userId = req.user.userId || req.params.userId;

  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "title product_uid short_description regular_price cover_image"
  );

  if (!wishlist.products.length) {
    throw new ApiError(404, "Wishlist not found for this user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

module.exports = getWishlistsController;
