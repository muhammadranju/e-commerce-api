const asyncHandler = require("../../../../../utils/asyncHandler");
const Orders = require("../../../../../models/Orders.model/Orders.model");
const ApiResponse = require("../../../../../utils/ApiResponse");
const findAllOrdersController = asyncHandler(async (req, res) => {
  const { type } = req.query;

  if (!type) {
    const orders = await Orders.find();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ordersLength: orders.length, orders },
          "Order found successfully"
        )
      );
  }

  const orders = await Orders.find({ paymentStatus: type });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ordersLength: orders.length, orders },
        "Order found successfully"
      )
    );
});

module.exports = findAllOrdersController;
