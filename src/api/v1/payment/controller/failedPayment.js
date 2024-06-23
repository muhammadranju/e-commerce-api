const { PaymentStatus } = require("../../../../constants");
const Order = require("../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const failPaymentController = asyncHandler(async (req, res) => {
  const {
    tran_id,
    card_type,
    card_no,
    bank_tran_id,
    currency,
    card_issuer,
    card_brand,
    card_issuer_country,
    tran_date,
  } = req.body;
  // Extract transaction ID from the request body

  if (!tran_id) {
    throw new ApiError(400, "Transaction ID is required");
  }

  // Find the order with the given transaction ID
  const findOrder = await Order.findOne({ transactionID: tran_id });

  // If the order is not found, throw an error
  if (!findOrder) {
    throw new ApiError(404, `Order not found for transaction ID ${tran_id}`);
  }

  // If the order has already been paid, throw an error
  if (findOrder.paymentStatus === PaymentStatus.FAILED) {
    throw new ApiError(400, "Order already failed");
  }

  // Create an object to store payment details from the request body
  const paymentType = {
    card_type,
    card_no,
    bank_tran_id,
    currency,
    card_issuer,
    card_brand,
    card_issuer_country,
    tran_date,
  };

  // Update the order's payment status and payment details
  findOrder.paymentStatus = PaymentStatus.FAILED;
  findOrder.paymentMethods = card_brand;
  findOrder.paymentType = paymentType;

  // Save the updated order to the database
  await findOrder.save();

  res.status(200).json(new ApiResponse(200, "Payment failed successfully"));
});
module.exports = failPaymentController;
