const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const { default: slugify } = require("slugify");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    socialMedia: {
      type: {
        _id: false,
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        // ... Add other platforms as needed
      },
      default: {},
    },
    products: {
      type: [
        { type: mongoose.Schema.Types.ObjectId, ref: ModelRefNames.Product },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line no-unused-vars
BrandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = `${slugify(this.name, { lower: true })}`;
  }
});

const Brand = mongoose.model(ModelRefNames.Brand, BrandSchema);
module.exports = Brand;
