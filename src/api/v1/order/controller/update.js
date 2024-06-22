const mongoose = require("mongoose");
const asyncHandler = require("../../../../utils/asyncHandler");
const Order = require("../../../../models/Orders.model/Orders.model");
const { OrderStatusEnum } = require("../../../../constants");
const ApiResponse = require("../../../../utils/ApiResponse");
const ApiError = require("../../../../utils/ApiError");

const updateOrderController = asyncHandler(async (req, res) => {
  const { status: requestedStatus } = req.body;
  const { orderId } = req.params;
  const userId = req.user.userId;

  // Input validation
  if (!orderId || !requestedStatus) {
    throw new ApiError(400, "Order ID and status are required.");
  }

  // Convert status to uppercase and trim whitespace
  const status = requestedStatus.trim().toUpperCase();

  // Check if status is valid
  if (status !== OrderStatusEnum.CANCELLED) {
    throw new ApiError(400, "Invalid status. User can only cancel the order.");
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

  // Check if the user is authorized to update the order
  if (order.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to update order");
  }

  // Update the order status and save it to the database
  order.status = status;
  await order.save({ validateBeforeSave: false });

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
  // Return the updated order in the response
  return res.json(
    new ApiResponse(200, { order, links }, "Order updated successfully")
  );
});

module.exports = updateOrderController;
