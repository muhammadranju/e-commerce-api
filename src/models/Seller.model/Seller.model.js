const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: Object,
      required: true,
      properties: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    },
    contactNumber: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Add additional fields as needed, like:
    // - logo: { type: String },
    // - products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // - ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model(ModelRefNames.Seller, sellerSchema);
