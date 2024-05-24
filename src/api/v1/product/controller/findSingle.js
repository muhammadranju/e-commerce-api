const Product = require("../../../../models/Products.model/Products.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Handles the HTTP request for finding a single product by its id or SKU.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 * @throws {ApiError} - Throws an ApiError with a 400 status code if the productId is not provided.
 * @throws {ApiError} - Throws an ApiError with a 404 status code if the product is not found.
 */
const findSingle = asyncHandler(async (req, res) => {
  // Get the productId from the request parameters
  const { productId } = req.params;

  // Check if the productId is provided
  if (!productId) {
    throw new ApiError(400, "productId is required");
  }

  // Find the product in the database using the productId or SKU
  const product = await Product.findOne({
    $or: [{ slug: productId }, { SKU: productId }],
  }).populate("comments");

  // Check if the product is found in the database
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const host = req.apiHost;
  const links = [
    {
      rel: "self",
      href: `${host}/products/${productId}`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/products`,
      method: "POST",
    },
    {
      rel: "update",
      href: `${host}/products/${productId}`,
      method: "PUT",
    },
    {
      rel: "delete",
      href: `${host}/products/${productId}`,
      method: "DELETE",
    },
    {
      rel: "list",
      href: `${host}/products`,
      method: "GET",
    },
  ];

  // Return the product as a JSON response with a 200 status code (OK) and a success message
  return res.json(new ApiResponse(200, { product, links }, "Product found"));
});

module.exports = findSingle;
