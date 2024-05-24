const Wishlist = require("../../../../models/Wishlist.model/Wishlist.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const deleteWishlistController = asyncHandler(async (req, res) => {
  // Destructure userId and productId for clarity
  const { userId } = req.user;
  const productId = req.body.productId;

  // Validate input (optional, but recommended)
  if (!userId || !productId) {
    throw new ApiError(400, "Missing required fields: userId and productId");
  }

  // Find the wishlist using userId
  const wishlist = await Wishlist.findOne({ user: userId });

  // Check if wishlist exists and throw an error if not
  if (!wishlist.products.length) {
    throw new ApiError(404, "Wishlist is empty for this user");
  }

  // Efficient product removal using MongoDB update operator ($pull)
  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $pull: { products: productId },
    },
    { new: true } // Return the updated document
  );

  // Check if update was successful (not strictly necessary, but informative)
  if (!updatedWishlist) {
    throw new ApiError(500, "Error removing product from wishlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWishlist, "Item removed from wishlist"));
});

module.exports = deleteWishlistController;
