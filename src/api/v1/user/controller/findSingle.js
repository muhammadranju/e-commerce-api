const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const getController = asyncHandler(async (req, res) => {
  // get user from database using user id
  const user = await User.findById({ _id: req.user?.userId })
    .populate("addresses")
    .populate([{ path: "wishlists", populate: "products" }])
    .populate([{ path: "orders", populate: "items" }])
    .populate([{ path: "carts", populate: "items.productId" }]);
  // .select("-password -accessToken -isEmailVerify -status");

  // check user is found or not in case it work
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const host = req.apiHost;
  // HATEOAS links
  const links = [
    {
      rel: "update_profile",
      href: `${host}/users/profile`,
      method: "PUT",
      description: "Update Profile",
    },
    {
      rel: "view_addresses",
      href: `${host}/users/profile/address`,
      method: "GET",
      description: "View Addresses",
    },
    {
      rel: "view_wishlists",
      href: `${host}/wishlists`,
      method: "GET",
      description: "View Wishlists",
    },
    {
      rel: "view_orders",
      href: `${host}/orders`,
      method: "GET",
      description: "View Orders",
    },
    {
      rel: "view_cart",
      href: `${host}/carts`,
      method: "GET",
      description: "View Cart",
    },
    // Add more links as needed
  ];

  return res
    .status(200)
    .json(new ApiResponse(200, { user, links }, "user data get successfully."));
});

module.exports = getController;
