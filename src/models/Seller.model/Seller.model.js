/* eslint-disable no-undef */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelRefNames.Store,
      // required: true,
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
      seller_id: this._id,
      email: this.email,
      username: this.name,
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

sellerSchema.methods.generateTemporaryToken = function () {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const SELLER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

  // This is the expiry time for the token (20 minutes)
  const tokenExpiry = Date.now() + SELLER_TEMPORARY_TOKEN_EXPIRY;

  return { unHashedToken, hashedToken, tokenExpiry };
};

const Seller = mongoose.model(ModelRefNames.Seller, sellerSchema);
module.exports = Seller;
