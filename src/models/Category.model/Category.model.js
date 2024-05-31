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
      default: null,
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
    this.category_url = `${slugify(this.name, {
      lower: true,
    })}`;
    // const make_url = this.name?.split(" ")?.join("_")?.toLocaleLowerCase();
    // this.category_url = make_url;
  }
  next();
});

const Category = model(ModelRefNames.Category, categorySchema);
module.exports = Category;
