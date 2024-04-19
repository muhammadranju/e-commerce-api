const Seller = require("../../models/Seller.model/Seller.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * Handles the HTTP request for retrieving a seller's profile.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.seller_id - The ID of the seller to retrieve the profile for.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 * @throws {ApiError} - Throws an ApiError with a 404 status code if the seller is not found.
 * @throws {ApiError} - Throws an ApiError with a 400 status code if the seller's email is not verified.
 */
/**
 * Function: getSellerProfilePostController
 * Description: This function is an arrow function that handles the logic for retrieving a seller's profile.
 * Parameters:
 *   - req: The request object containing the parameters.
 *   - res: The response object used to send the response.
 * Returns: The function does not return anything directly, but it sends a response to the client.
 * Throws:
 *   - ApiError(404): If the seller is not found.
 *   - ApiError(400): If the seller's account is not verified.
 */
const getSingleSellerProfilePostController = asyncHandler(async (req, res) => {
  const seller_id = req.params.seller_id;

  const seller = await Seller.findOne({
    $or: [{ sellerUID: seller_id }, { shopUrlLink: seller_id }],
  });

  if (!seller) {
    throw new ApiError(404, "Seller not found.");
  }

  console.log(seller._id);

  if (!seller.isEmailVerified) {
    throw new ApiError(400, "Seller account not verified yet.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Get seller account successfully."));
});
const getSellerProfilePostController = asyncHandler(async (req, res) => {
  const seller_id = req?.seller?.sellerId;

  const seller = await Seller.findById({ _id: seller_id });

  if (!seller) {
    throw new ApiError(404, "Seller not found.");
  }

  console.log(seller._id);

  if (!seller.isEmailVerified) {
    throw new ApiError(400, "Your account not verified yet.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Get your account successfully."));
});

/**
 * Handles the HTTP request for updating a seller's profile.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const updateSellerProfilePostController = asyncHandler(async (req, res) => {});

module.exports = {
  getSellerProfilePostController,
  getSingleSellerProfilePostController,
  updateSellerProfilePostController,
};
