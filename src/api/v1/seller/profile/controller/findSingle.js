const Seller = require("../../../../../models/Seller.model/Seller.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const profileGetController = asyncHandler(async (req, res) => {
  // Extract the seller ID from the request parameters
  const sellerId = req.params.seller_id;

  // Find the seller in the database using their ID or shop URL link
  const seller = await Seller.findOne({
    $or: [{ sellerUID: sellerId }, { shopUrlLink: sellerId }],
  });

  // If the seller is not found, throw a 404 error
  if (!seller) {
    throw new ApiError(404, "Seller not found.");
  }

  // Log the seller's ID for debugging purposes
  console.log(seller._id);

  // If the seller's email is not verified, throw a 400 error
  if (!seller.isEmailVerified) {
    throw new ApiError(400, "Seller account not verified yet.");
  }

  const sellerInfo = {
    name: seller.name,
    shopName: seller.shopName,
    shopDescription: seller.shopDescription,
    isEmailVerified: seller.isEmailVerified,
  };

  const host = req.apiHost;
  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/seller/profile/${seller._id}`,
      method: "GET",
      description: "Retrieve your profile information",
    },
    {
      rel: "update",
      href: `${host}/seller/profile/${seller._id}`,
      method: "PUT",
      description: "Update your profile information",
    },
    {
      rel: "delete",
      href: `${host}/seller/profile/${seller._id}`,
      method: "DELETE",
      description: "Delete your profile",
    },
  ];

  // Return the seller's profile in the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sellerInfo,
        links,
      },
      "Get seller account successfully."
    )
  );
});

module.exports = profileGetController;
