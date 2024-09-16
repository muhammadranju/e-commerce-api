const mongoose = require("mongoose");
const Order = require("../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../utils/ApiError");
const asyncHandler = require("../../../../utils/asyncHandler");
const ApiResponse = require("../../../../utils/ApiResponse");

/**
 * Asynchronously retrieves a single order from the database by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the retrieved order.
 */
const findSingleOrderController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  // Check if orderId is provided
  if (!orderId) {
    throw new ApiError(400, "Order ID is required.");
  }

  // Check if orderId is valid
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order id. Please provide a valid order id."
    );
  }

  // Find the order by orderId and populate user and items details
  const order = await Order.findById(orderId)
    .populate("user") // Populate user details
    .populate({
      // Populate items details including product details
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const host = req.apiHost;
  const links = [
    {
      rel: "self",
      href: `${host}/orders`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/orders`,
      method: "POST",
    },
    {
      rel: "update",
      href: `${host}/orders`,
      method: "PUT",
    },
    {
      rel: "delete",
      href: `${host}/orders`,
      method: "DELETE",
    },
    {
      rel: "all-orders",
      href: `${host}/orders`,
      method: "GET",
    },
  ];

  // Return the retrieved order in the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { order, links }, "Order retrieved successfully")
    );
});

module.exports = findSingleOrderController;
