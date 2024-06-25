const asyncHandler = require("../../../../../utils/asyncHandler");
const Orders = require("../../../../../models/Orders.model/Orders.model");
const ApiResponse = require("../../../../../utils/ApiResponse");
const { OrderStatusEnum } = require("../../../../../constants");

// Controller for tracking order status
const orderTrackingController = asyncHandler(async (req, res) => {
  const { trackingNumber } = req.body;

  // Fetch order based on tracking number and populate shipping address
  const order = await Orders.findOne({
    trackingNumber: trackingNumber,
  }).populate("shippingAddressId");

  // If no order is found, return a 404 response
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

  // Function to create a response
  const createResponse = (heading, body) =>
    new ApiResponse(200, { heading, body });

  // Determine the response based on the order status
  let response;
  switch (order.orderStatus) {
    case OrderStatusEnum.PENDING:
      response = createResponse(
        "Processed and Ready to Ship",
        "Your package has been processed and will be with our delivery partner soon."
      );
      break;
    case OrderStatusEnum.CANCELLED:
      response = createResponse(
        "Your Order has been cancelled",
        "Your order has been cancelled due to some reasons."
      );
      break;

    case OrderStatusEnum.PLACED:
      response = createResponse(
        "Reached our Logistics Facility",
        "Your package has arrived at our logistics facility from where it will be sent to the last mile hub."
      );
      break;

    case OrderStatusEnum.SHIPPED:
      response = createResponse(
        "Shipped",
        `Your package is on the way to our last hub with tracking number ${order.trackingNumber} from where it will be delivered to you.`
      );
      break;

    case OrderStatusEnum.OUT_FOR_DELIVERY:
      response = createResponse(
        "Out for Delivery",
        `Our delivery partner will attempt to deliver your package today to ${order.shippingAddressId?.city}.`
      );
      break;

    case OrderStatusEnum.DELIVERED:
      response = createResponse(
        "Delivered",
        `Your package has been delivered to ${order.shippingAddressId?.city}.`
      );
      break;

    default:
      // Default response for any other status
      response = new ApiResponse(200, order, "Order status found successfully");
      break;
  }

  // Send the response to the client
  return res.status(200).json(response);
});

module.exports = orderTrackingController;
