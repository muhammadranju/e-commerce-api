// Import required models and utilities
const User = require("../../../../models/User.model/User.model");
const Wishlist = require("../../../../models/Wishlist.model/Wishlist.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Controller function to handle creation of a wishlist item
const createWishlistController = asyncHandler(async (req, res) => {
  // Extract productId and userId from request body or user object
  const { productId } = req.body;
  const userId = req.user.userId || req.body.userId;

  // Check if productId or userId is missing
  if (!productId || !userId) {
    throw new ApiError(400, "Product id is required");
  }

  // Find existing wishlist for the user
  let existingWishlist = await Wishlist.findOne({ user: userId });
  const user = await User.findById(userId);

  // Check if the item already exists in the wishlist
  if (
    existingWishlist &&
    existingWishlist.products.find((item) => item.equals(productId))
  ) {
    throw new ApiError(400, "Item already exists in wishlist");
  }

  let wishlist;
  if (existingWishlist) {
    wishlist = existingWishlist;
    // Add new product to existing wishlist
    wishlist.products.push(productId);
  } else {
    // Create a new wishlist with the product
    wishlist = new Wishlist({ user: userId, products: [productId] });
  }

  // Add existing wishlist to user's wishlist array
  user.wishlists.push(wishlist._id);

  // Save the updated wishlist
  await wishlist.save();
  await user.save({ validateBeforeSave: false });

  // HATEOAS links
  const links = [
    {
      rel: "view_wishlist",
      href: `/wishlists`,
      method: "GET",
      description: "View Wishlist",
    },
    // Add more links as needed
  ];
  // Return success response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { wishlist, links },
        "Item added to wishlist successfully"
      )
    );
});

module.exports = createWishlistController;
