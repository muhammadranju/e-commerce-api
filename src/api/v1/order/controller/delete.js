const mongoose = require("mongoose");
const Order = require("../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Asynchronously deletes an order from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response indicating the success of deletion.
 */
const deleteOrderController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

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

  // Find the order by orderId
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if the user is authorized to delete the order
  if (order.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to delete order");
  }

  // Delete the order from the database
  await order.deleteOne();

  const host = req.apiHost;

  const links = [
    {
      rel: "self",
      href: `${host}/orders/${orderId}`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/orders`,
      method: "POST",
    },
    {
      rel: "user-orders",
      href: `${host}/users/profile/orders`,
      method: "GET",
    },
  ];

  // Return the response indicating successful deletion
  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { deleted: "204 No Content", orderId: order._id, links },
        "Order deleted successfully"
      )
    );
});

module.exports = deleteOrderController;
