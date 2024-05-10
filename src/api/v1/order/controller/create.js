const { OrderStatusEnum, PaymentStatus } = require("../../../../constants");
const Order = require("../../../../models/Orders.model/Orders.model");
const OrdersItem = require("../../../../models/OrdersItem.model/OrdersItem.model");
const Product = require("../../../../models/Products.model/Products.model");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const createOrderController = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;

  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error("Invalid product ID");
      }
      const orderItem = new OrdersItem({
        product: item.productId,
        quantity: item.quantity,
        price: product.price, // Assuming price is a field in Product
      });
      await orderItem.save();
      return orderItem;
    })
  );

  const total = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const order = new Order({
    user: userId,
    items: orderItems.map((item) => item._id),
    totalAmount: total,
    status: OrderStatusEnum.PENDING, // Default status
    paymentStatus: PaymentStatus.PENDING, // Default payment status
  });

  await order.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order created successfully."));
});

module.exports = createOrderController;
