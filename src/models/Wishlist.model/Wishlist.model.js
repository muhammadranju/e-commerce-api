const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: ModelRefNames.User, // Replace 'User' with your User model name
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ModelRefNames.Product, // Replace 'Product' with your Product model name
        sparse: true, // Exclude empty product references (optional)
      },
    ],
  },
  { timestamps: true }
);

wishlistSchema.pre("save", async function (next) {
  // Optional: Handle nested validation or custom logic here
  next();
});

wishlistSchema.methods.addProduct = async function (productId) {
  // Check if product already exists (optional)
  if (this.products.includes(productId)) {
    return; // Or throw an error if duplicates are not allowed
  }

  this.products.push(productId);
  await this.save();
};

wishlistSchema.methods.removeProduct = async function (productId) {
  const productIndex = this.products.indexOf(productId);
  if (productIndex !== -1) {
    this.products.splice(productIndex, 1);
    await this.save();
  } else {
    // Handle product not found case (optional)
  }
};
const Wishlist = mongoose.model(ModelRefNames.Wishlist, wishlistSchema);
module.exports = Wishlist;
