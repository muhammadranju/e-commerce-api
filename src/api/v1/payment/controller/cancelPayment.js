const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const cancelPaymentController = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Payment cancelled successfully"));
});
module.exports = cancelPaymentController;
