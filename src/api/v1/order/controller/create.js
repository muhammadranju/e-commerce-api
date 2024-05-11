const { OrderStatusEnum, PaymentStatus } = require("../../../../constants");
const Order = require("../../../../models/Orders.model/Orders.model");
const OrdersItem = require("../../../../models/OrdersItem.model/OrdersItem.model");
const Product = require("../../../../models/Products.model/Products.model");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const createOrderController = asyncHandler(async (req, res) => {
  // Extract necessary information from the request body and authenticated user
  const { items, shippingAddressId } = req.body;
  const userId = req.user.userId;

  // Use Promise.all to handle asynchronous operations for each item in parallel
  const orderItems = await Promise.all(
    items.map(async (item) => {
      // Fetch the product associated with the item from the database
      const product = await Product.findById(item.productId);
      // Check if the product exists
      if (!product) {
        throw new Error("Invalid product ID");
      }

      // Create an order item instance with necessary details
      const orderItem = new OrdersItem({
        product: item.productId,
        quantity: item.quantity,
        price: product.regular_price,
        // Assuming price is a field in Product
      });
      // Save the order item to the database
      await orderItem.save();
      return orderItem;
    })
  );

  // Calculate the total price of the order
  const total = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Create an order instance
  const order = new Order({
    user: userId,
    items: orderItems.map((item) => item._id),
    totalAmount: total,
    status: OrderStatusEnum.PENDING, // Default status
    shippingAddressId, // Default shipping address ID
    paymentStatus: PaymentStatus.PENDING, // Default payment status
  });
  // Save the order to the database
  await order.save();

  // Respond with success status and the created order
  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order created successfully."));
});

module.exports = createOrderController;
