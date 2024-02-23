const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    socialMedia: {
      type: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        // ... Add other platforms as needed
      },
      default: {},
    },
    products: {
      type: [
        { type: mongoose.Schema.Types.ObjectId, ref: ModelRefNames.Product },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(ModelRefNames.Brand, BrandSchema);
