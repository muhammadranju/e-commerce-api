const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");

const addressSchema = new mongoose.Schema({
  // User ID (optional, depending on your data structure)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelRefNames.User,
  },
  // Basic address information
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
  },
  // Additional optional fields
  phoneNumber: {
    type: Number,
  },
  companyName: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(ModelRefNames.Address, addressSchema);
