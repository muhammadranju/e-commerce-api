const { Schema, model } = require("mongoose");
const { ModelRefNames } = require("../../constants");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortTitle: {
      type: String,
      required: true,
      lowercase: true,
    },
    destruction: {
      type: String,
      required: true,
    },
    productStatus: {
      type: Boolean,
      default: false,
    },
    sellerStoreId: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Seller,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Category,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    coverImage: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Brand,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    comments: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Comments,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model(ModelRefNames.Product, productSchema);
module.exports = Product;
