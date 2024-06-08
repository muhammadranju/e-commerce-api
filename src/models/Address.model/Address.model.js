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

    ship_name: {
      type: String,
    },
    ship_address: {
      type: String,
    },

    ship_city: {
      type: String,
    },
    ship_state: {
      type: String,
    },
    ship_postcode: {
      type: String,
    },

    ship_country: {
      type: String,
    },

    ship_phone: {
      type: String,
    },

    isDefaultDelivery: {
      type: Boolean,
      default: isDefault.UNVERIFIED,
    },
    isDefaultBilling: {
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
