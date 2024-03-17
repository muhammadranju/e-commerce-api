const mongoose = require("mongoose");
const { ModelRefNames } = require("../../constants");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand_url: {
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

BrandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const make_url = this.name?.split(" ")?.join("_")?.toLocaleLowerCase();
    this.brand_url = make_url;
  }
});

const Brand = mongoose.model(ModelRefNames.Brand, BrandSchema);
module.exports = Brand;
