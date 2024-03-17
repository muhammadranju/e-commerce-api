const { Schema, model } = require("mongoose");
const {
  ModelRefNames,
  PaymentMethods,
  PaymentStatus,
} = require("../../constants");

const paymentSchema = new Schema(
  {
    // User who made the payment
    user: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.User,
      required: true,
    },

    // Order associated with the payment
    order: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Order,
      required: true,
    },

    // Amount paid
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    // Payment method used
    method: {
      type: String,
      required: true,
      enum: [
        PaymentMethods.CREDIT_CARD,
        PaymentMethods.DEBIT_CARD,
        PaymentMethods.NET_BANKING,
        PaymentMethods.WALLET,
        PaymentMethods.CASH_ON_DELIVERY,
      ],
    },

    // Payment gateway used (if applicable)
    gateway: {
      type: String,
    },

    // Transaction ID from payment gateway
    transaction_id: {
      type: String,
    },

    // Payment status
    status: {
      type: String,
      required: true,
      enum: [
        PaymentStatus.PENDING,
        PaymentStatus.SUCCEEDED,
        PaymentStatus.FAILED,
        PaymentStatus.CANCELLED,
        PaymentStatus.REFUNDED,
      ],
    },

    // Additional payment information (optional)
    details: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model(ModelRefNames.Payment, paymentSchema);
module.exports = Payment;
