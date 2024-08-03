// Import necessary modules and utilities
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const config = require("../../../../config/config");
const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../../../../models/Orders.model/Orders.model");
const User = require("../../../../models/User.model/User.model");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const { PaymentStatus } = require("../../../../constants");
const { default: mongoose } = require("mongoose");

// Define the createPaymentController function
const createPaymentController = asyncHandler(async (req, res) => {
  const { paymentId } = req.params; // Extract payment ID from request parameters
  const { userId } = req.user; // Extract user ID from the authenticated user

  // Validate required parameters
  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required for this route");
  }
  // Validate payment ID
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid Payment ID format");
  }

  // Fetch the user by user ID
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found for this payment ID");
  }

  // Fetch the addresses associated with the user
  const addressList = await Address.find({ userId });

  const findAddress = addressList.length > 0 ? addressList[0] : null; // Assuming a single address is used for the payment

  // Find the order by payment ID and populate related fields
  const findOrder = await Order.findById(paymentId)
    .populate("user")
    .populate("shippingAddressId")
    .populate({ path: "items", populate: "product" });

  // Check if the order exists
  if (!findOrder) {
    throw new ApiError(404, "Order not found for this payment ID");
  }

  // Check if the order has already been paid for
  if (findOrder.paymentStatus === PaymentStatus.SUCCEEDED) {
    throw new ApiError(400, "Your payment already succeeded for this order");
  }
  if (findOrder.paymentStatus === PaymentStatus.FAILED) {
    throw new ApiError(400, "Your payment already failed for this order");
  }
  // Extract the first product item in the order
  const findProductId = findOrder.items.length > 0 ? findOrder.items[0] : null;
  if (!findProductId) {
    throw new ApiError(400, "No items found in the order for this payment ID");
  }

  // Define the host URL from the request
  const host = req.apiHost;

  // Create the data object required for SSLCommerz payment initiation
  const data = {
    total_amount: findOrder?.totalAmount,
    currency: "BDT",
    tran_id: findOrder.transactionID, // Use unique transaction ID for each API call
    success_url: `${host}/payment/success`,
    fail_url: `${host}/payment/failed`,
    cancel_url: `${host}/payment/cancel`,
    ipn_url: `${host}/payment/ipn`,
    shipping_method: "NO",
    product_name: findProductId.product.title,
    product_category: "Electronic",
    product_profile: "general",
    cus_name: `${user?.firstName} ${user?.lastName}`,
    cus_email: user.email,
    cus_add1: findAddress?.addressLine1,
    cus_add2: findAddress?.addressLine2,
    cus_city: findAddress?.city,
    cus_state: findAddress?.state,
    cus_postcode: findAddress?.postalCode,
    cus_country: findAddress?.country,
    cus_phone: findAddress?.phoneNumber,
    cus_fax: findAddress?.phoneNumber,
    ship_name: `${user?.firstName} ${user?.lastName}`,
    ship_add1: findOrder?.shippingAddressId?.addressLine1,
    ship_add2: findOrder?.shippingAddressId?.addressLine2,
    ship_city: findOrder?.shippingAddressId?.city,
    ship_state: findOrder?.shippingAddressId?.state,
    ship_postcode: findOrder?.shippingAddressId?.postalCode,
    ship_country: findOrder?.shippingAddressId?.country,
  };

  // Create an instance of SSLCommerzPayment with store credentials
  const sslCommerzInstance = new SSLCommerzPayment(
    config.SSL_STORE_ID,
    config.SSL_STORE_PASSWORD,
    // config.SSL_STORE_IS_LIVE,
    false
  );

  // Create HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/payment/${paymentId}`,
      method: "GET",
    },
    {
      rel: "payment/success",
      href: `${host}/payment/success`,
      method: "POST",
    },
    {
      rel: "payment/failed",
      href: `${host}/payment/failed`,
      method: "POST",
    },
    {
      rel: "payment/cancel",
      href: `${host}/payment/cancel`,
      method: "POST",
    },
    {
      rel: "payment/ipn",
      href: `${host}/payment/ipn`,
      method: "POST",
    },
    {
      rel: "order",
      order: `${host}/orders`,
      method: "GET",
    },
    {
      rel: "user",
      user: `${host}/users/profile/orders`,
      method: "GET",
    },
  ];

  // Initiate the payment and handle the response
  sslCommerzInstance
    .init(data)
    .then((apiResponse) => {
      const { GatewayPageURL } = apiResponse; // Extract the payment gateway URL
      console.log("Redirecting to:", GatewayPageURL); // Log the redirect URL

      res.status(200).json(
        new ApiResponse(
          200,
          { GatewayPageURL, links },
          "Payment created successfully"
        ) // Send success response
      );
    })
    // Handle errors
    .catch((error) => {
      console.error("Payment initialization error:", error);
      // Send error response
      throw new ApiError(500, "Payment initialization failed");
    });
});

// Export the createPaymentController function
module.exports = createPaymentController;
