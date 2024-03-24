const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  ModelRefNames,
  UserStatusEnum,
  VerifyStatus,
  AvailableUserStatus,
  AvailableUserRoles,
  UserRolesEnum,
  Gender,
} = require("../../constants");
const bcrypt = require("bcryptjs");
const sellerSchema = new mongoose.Schema(
  {
    logo: {
      _id: false,
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
        localPath: "",
      },
    },
    banner: {
      _id: false,
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/1920x1080.png`,
        localPath: "",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },

    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.SELLER,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    shopUrlLink: { type: String },
    shopDescription: {
      type: String,
      trim: true,
    },
    shopAddress: {
      type: Object,
      _id: false,
      required: true,
      addressLine: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      Country: { type: String, required: true },
      postalCode: { type: Number, required: true },
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    preferredCurrency: {
      type: String,
      default: "BDT", // Replace with your default currency
    },
    preferredLanguage: {
      type: String,
      default: "en-US", // Replace with your default language
    },
    newsletterSubscription: {
      type: Boolean,
      default: false,
    },
    marketingOptIn: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      uppercase: true,
      enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
    },

    isEmailVerified: {
      type: Boolean,
      enum: [VerifyStatus.VERIFY, VerifyStatus.UNVERIFIED],
      default: VerifyStatus.UNVERIFIED,
    },
    status: {
      type: String,
      enum: AvailableUserStatus,
      default: UserStatusEnum.PENDING,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },

    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    // Add additional fields as needed, like:
    // - logo: { type: String },
    // - products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // - ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

sellerSchema.methods.compareBcryptPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

sellerSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      user_id: this._id,
      email: this.email,
      username: this.username,
      status: true,
    },
    process.env.SELLER_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.SELLER_ACCESS_TOKEN_EXPIRY }
  );
};

sellerSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      user_id: this._id,
    },
    process.env.SELLER_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.SELLER_REFRESH_TOKEN_EXPIRY }
  );
};

const Seller = mongoose.model(ModelRefNames.Seller, sellerSchema);
module.exports = Seller;
