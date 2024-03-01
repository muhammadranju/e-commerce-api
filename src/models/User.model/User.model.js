const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");
const {
  ModelRefNames,
  Gender,
  UserLoginType,
  VerifyStatus,
} = require("../../constants");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
    },

    firstName: {
      type: String,
      required: String,
    },
    lastName: {
      type: String,
      required: String,
    },
    preferredCurrency: {
      type: String,
      default: "USD", // Replace with your default currency
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
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      uppercase: true,
      enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
    },
    loginType: {
      type: String,
      enum: [
        UserLoginType.EMAIL_PASSWORD,
        UserLoginType.GITHUB,
        UserLoginType.GOOGLE,
      ],
    },
    isEmailVerify: {
      type: Boolean,
      enum: [VerifyStatus.VERIFY, VerifyStatus.UNVERIFIED],
      default: VerifyStatus.UNVERIFIED,
    },

    emailVerifyToken: {
      type: String,
    },
    emailVerifyTokenExpiry: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    accessTokenExpiry: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
    refreshTokenExpiry: {
      type: String,
    },

    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelRefNames.Address,
      },
    ],
    wishList: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelRefNames.Product,
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelRefNames.Order,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.compareBcryptPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      user_id: this._id,
      email: this.email,
      username: this.username,
      status: true,
    },
    process.env.ACCESS_TOKEN_EXPIRY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const User = model(ModelRefNames.User, userSchema);

module.exports = User;
