const asyncHandler = require("../../../../../utils/asyncHandler");
const Orders = require("../../../../../models/Orders.model/Orders.model");
const ApiResponse = require("../../../../../utils/ApiResponse");
const findOrdersController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const orders = await Orders.findById(orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, { orders }, "Single order found successfully"));
});

module.exports = findOrdersController;
