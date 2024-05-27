const Seller = require("../../../../../models/Seller.model/Seller.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const profileUpdateController = asyncHandler(async (req, res) => {
  // Extract the updated profile data from the request body
  const {
    name,
    shopName,
    shopDescription,
    shopAddress,
    preferredCurrency,
    preferredLanguage,
    newsletterSubscription,
    marketingOptIn,
  } = req.body;

  // Find the seller in the database using their ID
  const seller = await Seller.findById(req.seller.sellerId);

  // If no data is provided in the request body, return a success response
  if (!Object.keys(req.body).length) {
    // Check if the request body is empty
    return res
      .status(200)
      .json(new ApiResponse(200, seller, "No changes were made"));
  }

  // If the seller is not found, throw a 404 error
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  // Update the seller's data with the provided values, or keep the existing values if none provided
  seller.name = name || seller.name;
  seller.shopName = shopName || seller.shopName;
  seller.shopDescription = shopDescription || seller.shopDescription;
  seller.shopAddress = shopAddress || seller.shopAddress;
  seller.preferredCurrency = preferredCurrency || seller.preferredCurrency;
  seller.preferredLanguage = preferredLanguage || seller.preferredLanguage;
  seller.newsletterSubscription =
    newsletterSubscription || seller.newsletterSubscription;
  seller.marketingOptIn = marketingOptIn || seller.marketingOptIn;

  // Save the updated seller data to the database
  await seller.save({ validateBeforeSave: false });

  const host = req.apiHost;
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
  // Return a success response with the updated seller data
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        seller,
        links,
      },
      "Profile updated successfully"
    )
  );
});

module.exports = profileUpdateController;
