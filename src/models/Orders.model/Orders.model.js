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
    transactionID: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    paymentType: {
      type: {
        card_type: {
          type: String,
        },
        card_no: {
          type: String,
        },
        bank_tran_id: {
          type: String,
        },
        currency: {
          type: String,
        },
        card_issuer: {
          type: String,
        },
        card_brand: {
          type: String,
        },
        card_issuer_country: {
          type: String,
        },
      },
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
