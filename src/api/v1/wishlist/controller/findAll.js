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

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/wishlists`,
      method: "GET",
      description: "Get details of the user's wishlist",
    },
    {
      rel: "add-item",
      href: `${host}/wishlists`,
      method: "POST",
      description: "Add a new item to the wishlist",
    },
    {
      rel: "delete-item",
      href: `${host}/wishlists`,
      method: "DELETE",
      description: "Delete an item from the wishlist",
    },
    {
      rel: "user-profile",
      href: `${host}/users/profile`,
      method: "GET",
      description: "View user profile",
    },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(200, { wishlist, links }, "Wishlist fetched successfully")
    );
});

module.exports = getWishlistsController;
