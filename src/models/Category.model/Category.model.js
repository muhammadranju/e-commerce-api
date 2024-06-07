const { Schema, model } = require("mongoose");
const { ModelRefNames } = require("../../constants");
const { default: slugify } = require("slugify");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    category_url: {
      type: String,
    },
    description: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Category,
      default: undefined,
    },
    image: {
      type: String,
      default: "",
    },
    public_id: {
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
    this.category_url = `${slugify(this.name, {
      lower: true,
    })}`;
  }
  next();
});

const Category = model(ModelRefNames.Category, categorySchema);
module.exports = Category;
