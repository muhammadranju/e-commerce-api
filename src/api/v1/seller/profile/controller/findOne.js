const Seller = require("../../../../../models/Seller.model/Seller.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const profileCreateController = asyncHandler(async (req, res) => {
  // Extract the seller ID from the request object
  const sellerId = req?.seller?.sellerId;

  // Find the seller in the database using their ID
  const seller = await Seller.findById(sellerId);

  // If the seller is not found, throw a 404 error
  if (!seller) {
    throw new ApiError(404, "Seller not found.");
  }

  // If the seller's email is not verified, throw a 400 error
  if (!seller.isEmailVerified) {
    throw new ApiError(400, "Your account is not verified yet.");
  }

  const host = req.apiHost;
  // Construct HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/seller/profile`,
      method: "GET",
      description: "Retrieve your profile information",
    },
    {
      rel: "update",
      href: `${host}/seller/profile`,
      method: "PUT",
      description: "Update your profile information",
    },
    {
      rel: "delete",
      href: `${host}/seller/profile`,
      method: "DELETE",
      description: "Delete your profile",
    },
  ];

  // Return the seller's profile in the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        seller,
        links,
      },
      "Successfully retrieved your account."
    )
  );
});

module.exports = profileCreateController;
