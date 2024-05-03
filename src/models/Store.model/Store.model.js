const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { ModelRefNames } = require("../../constants");
const StoreSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
  storeUID: {
    type: String,
    default: uuidv4(),
  },
  storeURI: { type: String },

  storeDescription: {
    type: String,
    trim: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelRefNames.Seller,
  },
  logo: {
    _id: false,
    type: {
      url: {
        type: String,
      },
      localPath: {
        type: String,
      },
    },
    default: {
      url: `https://via.placeholder.com/200x200.png`,
      localPath: "",
    },
  },
  banner: {
    _id: false,
    type: {
      url: {
        type: String,
      },
      localPath: {
        type: String,
      },
    },
    default: {
      url: `https://via.placeholder.com/1500x350.png`,
      localPath: "",
    },
  },

  storeAddress: {
    type: Object,
    _id: false,
    required: true,
    addressLine: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
  },
});

const Store = mongoose.model(ModelRefNames.Store, StoreSchema);
module.exports = Store;
