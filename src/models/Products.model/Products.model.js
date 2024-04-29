const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const randomstring = require("randomstring");
const {
  ModelRefNames,
  PostStatusEnum,
  AvailablePostStatus,
} = require("../../constants");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    permalink: {
      type: String,
      lowercase: true,
      // https://example.com/product/premium-quality-19/
    },

    destruction: {
      type: String,
      required: true,
    },

    short_description: {
      type: String,
      required: true,
      trim: true,
    },

    featured: {
      type: String,
      required: true,
      default: false,
      //false
    },

    regular_price: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: this.regular_price,
    },

    sale_price: {
      type: Number,
      default: 0,
    },

    total_sales: {
      type: Number,
      default: 0,
    },

    weight: {
      type: String,
      required: false,
    },

    dimensions: {
      _id: false,

      length: {
        type: Number,
        default: 0,
        required: false,
      },

      width: {
        type: Number,
        required: false,
      },

      height: {
        type: Number,
        required: false,
      },
    },

    attributes: [
      {
        id: Number,
        position: Boolean,
        variation: Boolean,
        options: [],
      },
      {
        name: String,
        position: Number,
        visible: Boolean,
        variation: Boolean,
        options: [],
      },
    ],

    average_rating: {
      type: String,
      min: 0,
      max: 5,
      default: "0.00",
    },

    product_status: {
      type: String,
      enum: [AvailablePostStatus],
      default: PostStatusEnum.PENDING,
      // publish
    },

    seller_storeId: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Seller,
      required: true,
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Category,
      required: true,
    },

    cover_image: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    stock_quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },

    stock_status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
      required: true,
    },

    SKU: {
      type: String,
      required: true,
      unique: true,
      default: randomstring
        .generate({
          length: 12,
          charset: "alphanumeric",
        })
        ?.toUpperCase(),
    },

    tags: [
      {
        type: String,
        required: true,
      },
    ],

    brand: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Brand,
      required: true,
    },
    comments: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Comment,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
    this.permalink = `https://example.com/product/${this.slug}`;
  }
});

const Product = model(ModelRefNames.Product, productSchema);
module.exports = Product;
