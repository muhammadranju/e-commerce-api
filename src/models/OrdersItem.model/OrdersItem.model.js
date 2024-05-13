const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");

const OrdersItemsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
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

  // name: {
  //   type: String,
  //   required: true,
  // },
  // quantity: {
  //   type: Number,
  //   required: true,
  //   min: 1,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },
  // totalPrice: {
  //   type: Number,
  //   required: true,
  // },
  // discount: {
  //   type: Number,
  //   default: 0,
  // },
  // // Additional fields you might need
  // sku: { type: String },
  // image: { type: String },
  // size: { type: String },
  // color: { type: String },
  // etc.

  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const OrdersItem = mongoose.model(ModelRefNames.OrdersItem, OrdersItemsSchema);

module.exports = OrdersItem;
