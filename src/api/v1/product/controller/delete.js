const Product = require("../../../../models/Products.model/Products.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Asynchronous handler for deleting a product.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The API response.
 */
const deleteProduct = asyncHandler(async (req, res) => {
  /**
   * The productId parameter extracted from the request parameters.
   * @type {string}
   */
  const { productId } = req.params;

  // Attempt to find a product with the given productId.
  const product = await Product.findOne({ product_uid: productId });

  // If no product is found, throw a 404 error.
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  await Product.deleteOne();

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

  // Return a success response with the deleted product.
  return res
    .status(200)
    .json(
      new ApiResponse(200, { product, links }, "Product deleted successfully")
    );
});
module.exports = deleteProduct;
