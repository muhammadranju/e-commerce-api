const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const randomstring = require("randomstring");
const { v4: uuid4 } = require("uuid");
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
      lowercase: true,
    },

    product_uid: {
      type: String,
      default: uuid4(),
    }, //product_id

    permalink: {
      type: String,
      lowercase: true,
      // https://example.com/product/premium-quality-19/
    },

    description: {
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
      required: true,
    },

    dimensions: {
      _id: false,

      length: {
        type: Number,
        default: 0,
        required: true,
      },

      width: {
        type: Number,
        required: true,
      },

      height: {
        type: Number,
        required: true,
      },
    },

    attributes: [
      {
        id: Number,
        name: String,
        position: Number,
        visible: Boolean,
        variation: Boolean,
        options: [],
      },
    ],

    default_attributes: [
      {
        id: Number,
        name: String,
        options: [],
      },
    ],

    average_rating: {
      type: String,
      min: 0,
      max: 5,
      default: "0.00",
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

    product_status: {
      type: String,
      enum: AvailablePostStatus,
      default: PostStatusEnum.PENDING,
      // publish
    },

    seller_Id: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Seller,
      required: true,
    },
    store_Id: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Store,
      required: true,
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Category,
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: ModelRefNames.Brand,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelRefNames.Reviews,
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = `${slugify(this.title)}-${randomstring.generate({
      length: 4,
      charset: "alphanumeric",
    })}`;
    this.permalink = `https://example.com/product/${this.slug}`;
  }
  this.price = this.regular_price;

  this.default_attributes = this.attributes.map((attr) => ({
    ...attr,
    options: attr.options.slice(0, 1),
  }));
  next();
});

const Product = model(ModelRefNames.Product, productSchema);
module.exports = Product;
