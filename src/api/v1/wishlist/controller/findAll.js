const Wishlist = require("../../../../models/Wishlist.model/Wishlist.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const getWishlistsController = asyncHandler(async (req, res) => {
  const userId = req.user.userId || req.params.userId;

  const wishlist = await Wishlist.findOne({ user: userId })
    .populate("products")
    .populate("user") // Populate product details
    .select("+");

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found for this user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

module.exports = getWishlistsController;
