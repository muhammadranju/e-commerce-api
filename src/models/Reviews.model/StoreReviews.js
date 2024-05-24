const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");

const storeCommentsSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelRefNames.Product,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelRefNames.Comment,
    },
  ],
});
const StoreComments = mongoose.model("StoreComments", storeCommentsSchema);
module.exports = StoreComments;
