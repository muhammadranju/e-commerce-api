const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category_url: {
      type: String,
    },
    description: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelRefNames.Category,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// this method is doing create category url
categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const make_url = this.name?.split(" ")?.join("_")?.toLocaleLowerCase();
    this.category_url = make_url;
  }
});

const Category = mongoose.model(ModelRefNames.Category, categorySchema);
module.exports = Category;
