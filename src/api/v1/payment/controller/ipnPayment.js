const SSLCommerzPayment = require("sslcommerz-lts");
const config = require("../../../../config/config");
const { PaymentStatus } = require("../../../../constants");
const Order = require("../../../../models/Orders.model/Orders.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const ipnPaymentController = asyncHandler(async (req, res) => {
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
  const data = {
    val_id: req.body.val_id,
  };

  // Extract transaction ID from the request body

  console.log(req.body);
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
  if (findOrder.paymentStatus === PaymentStatus.SUCCEEDED) {
    throw new ApiError(400, "Order already paid");
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

  // Validate the payment using SSLCommerz
  const sslCommerzInstance = new SSLCommerzPayment(
    config.SSL_STORE_ID,
    config.SSL_STORE_PASSWORD
  );

  // Validate the payment
  sslCommerzInstance.validate(data).then(async (data) => {
    //process the response that got from sslcommerz
    // https://developer.sslcommerz.com/doc/v4/#order-validation-api
    if (data.status === PaymentStatus.STATUS) {
      // Update the order's payment status and payment details
      findOrder.paymentStatus = PaymentStatus.SUCCEEDED;
      findOrder.paymentMethods = card_type;
      findOrder.paymentType = paymentType;

      // Save the updated order to the database
      await findOrder.save();
    }
  });

  res
    .status(200)
    .json(new ApiResponse(200, { findOrder }, "Payment ipn successfully"));
});
module.exports = ipnPaymentController;
