const { Schema, model } = require("mongoose");
const {
  ModelRefNames,
  OrderStatusEnum,
  AvailableOrderStatuses,
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
        product: {
          type: Schema.Types.ObjectId,
          ref: ModelRefNames.Product,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    // Total amount of the order
    totalAmount: {
      type: Number,
      required: true,
    },
    // Shipping address
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
    paymentInfo: {
      type: {
        method: {
          type: String,
          required: true,
        },
        transactionId: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    },
    // Order status
    status: {
      type: String,
      enum: AvailableOrderStatuses,
      default: OrderStatusEnum.PLACED,
    },
  },
  { timestamps: true }
);

module.exports = model(ModelRefNames.Order, orderSchema);
