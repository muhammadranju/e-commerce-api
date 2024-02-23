const { Schema, model } = require("mongoose");
const { ModelRefNames } = require("../../constants");
const commentSchema = new Schema(
  {
    // Content of the comment
    content: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 500,
    },
    // Author of the comment
    author: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.User, // Reference to the User model
      required: true,
    },
    // Product or entity the comment is attached to
    product: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Product, // Reference to the Product model
      required: true,
    },
    // Rating associated with the comment (optional)
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// This makes createdAt and updatedAt fields automatically update
commentSchema.pre("save", (next) => {
  if (!this.updatedAt) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = model(ModelRefNames.Comment, commentSchema);
