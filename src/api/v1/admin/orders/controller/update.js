const Orders = require("../../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const updateOrdersController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const orders = await Orders.findById(orderId);

  if (!orders) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { orders }, "Update order successfully"));
});

module.exports = updateOrdersController;
