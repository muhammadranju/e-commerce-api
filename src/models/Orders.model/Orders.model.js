const { Schema, model, default: mongoose } = require("mongoose");
const {
  ModelRefNames,
  OrderStatusEnum,
  AvailableOrderStatuses,
  AvailablePaymentStatus,
  PaymentStatus,
  PaymentMethods,
  AvailablePaymentMethods,
} = require("../../constants");

const orderSchema = new Schema(
  {
    // User who placed the order
    user: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.User,
      required: true,
    },
    // Items ordered
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelRefNames.OrdersItem,
        required: true,
      },
    ],
    // Total amount of the order
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: AvailablePaymentStatus,
      default: PaymentStatus.UNPAID,
    },
    paymentMethods: {
      type: String,
      enum: AvailablePaymentMethods,
      default: PaymentMethods.CASH_ON_DELIVERY,
    },
    // Shipping address
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Address,
    },
    shippingAddress: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
        },
        postalCode: {
          type: String,
        },
        country: {
          type: String,
          required: true,
        },
      },
    },
    // Payment information
    // paymentInfo: {
    //   type: {
    //     method: {
    //       type: String,
    //       required: true,
    //     },
    //     transactionId: {
    //       type: String,
    //     },
    //     amount: {
    //       type: Number,
    //     },
    //   },
    // },
    // Order status
    orderStatus: {
      type: String,
      enum: AvailableOrderStatuses,
      default: OrderStatusEnum.PLACED,
    },
  },
  { timestamps: true }
);

const Order = model(ModelRefNames.Order, orderSchema);
module.exports = Order;
