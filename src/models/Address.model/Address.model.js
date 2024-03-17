const mongoose = require("mongoose");
const { ModelRefNames, VerifyStatus: isDefault } = require("../../constants");

const addressSchema = new mongoose.Schema(
  {
    // User ID depending on your data structure
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelRefNames.User,
    },
    // Basic address information
    addressName: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Bangladesh",
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    // Additional optional fields
    companyName: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: isDefault.UNVERIFIED,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model(ModelRefNames.Address, addressSchema);

module.exports = Comment;
