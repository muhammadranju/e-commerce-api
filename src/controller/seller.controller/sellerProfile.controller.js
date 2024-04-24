const Seller = require("../../models/Seller.model/Seller.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { URI } = require("../../constants");

/**
 * Handles the HTTP request for retrieving a specific seller's profile.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 * @throws {ApiError} - Throws an ApiError with a 404 status code if the seller is not found.
 * @throws {ApiError} - Throws an ApiError with a 400 status code if the seller's account is not verified.
 */
const getSingleSellerProfilePostController = asyncHandler(async (req, res) => {
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

  // Return the seller's profile in the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        links: {
          self: `${URI}/seller/profile`,
          next: `${URI}/seller/profile/${sellerId}`,
        },
        sellerInfo,
      },
      "Get seller account successfully."
    )
  );
});

/**
 * Handles the HTTP request for retrieving a seller's profile.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 * @throws {ApiError} - Throws an ApiError with a 404 status code if the seller is not found.
 * @throws {ApiError} - Throws an ApiError with a 400 status code if the seller's email is not verified.
 */
const getSellerProfilePostController = asyncHandler(async (req, res) => {
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

  // Return the seller's profile in the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        links: {
          self: `${URI}/seller/profile`,
          next: `${URI}/seller/profile/${sellerId}`,
        },
        seller,
      },
      "Successfully retrieved your account."
    )
  );
});

/**
 * Handles the HTTP request for updating a seller's profile.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the updated profile data.
 * @param {string} req.body.name - The updated name of the seller.
 * @param {string} req.body.shopName - The updated shop name of the seller.
 * @param {string} req.body.shopDescription - The updated shop description of the seller.
 * @param {string} req.body.shopAddress - The updated shop address of the seller.
 * @param {string} req.body.preferredCurrency - The updated preferred currency of the seller.
 * @param {string} req.body.preferredLanguage - The updated preferred language of the seller.
 * @param {boolean} req.body.newsletterSubscription - The updated newsletter subscription status of the seller.
 * @param {boolean} req.body.marketingOptIn - The updated marketing opt-in status of the seller.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const updateSellerProfilePostController = asyncHandler(async (req, res) => {
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

  // Return a success response with the updated seller data
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        links: {
          self: `${URI}/seller/profile`,
          next: `${URI}/seller/profile/${seller._id}`,
        },
        seller,
      },
      "Profile updated successfully"
    )
  );
});

module.exports = {
  getSellerProfilePostController,
  getSingleSellerProfilePostController,
  updateSellerProfilePostController,
};
