const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  ModelRefNames,
  Gender,
  UserLoginType,
  VerifyStatus,
  UserStatusEnum,
  AvailableSocialLogins,
  AvailableUserRoles,
  UserRolesEnum,
  AvailableUserStatus,
} = require("../../constants");

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
        localPath: "",
      },
    },
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
      index: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
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

    gender: {
      type: String,
      uppercase: true,
      enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
    },
    loginType: {
      type: String,
      enum: AvailableSocialLogins,
      default: UserLoginType.EMAIL_PASSWORD,
    },
    isEmailVerify: {
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

// this function do password hashing using bcrypt.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// this methods do compare user password
userSchema.methods.compareBcryptPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// this methods do generate a access token using on jwt
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      user_id: this._id,
      email: this.email,
      username: this.username,
      status: true,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// this methods do generate a refresh token using on jwt
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      user_id: this._id,
    },
    process.env.SELLER_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.SELLER_REFRESH_TOKEN_EXPIRY }
  );
};

// this methods do generate temporary token using crypto
userSchema.methods.generateTemporaryToken = function () {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

  // This is the expiry time for the token (20 minutes)
  const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

  return { unHashedToken, hashedToken, tokenExpiry };
};

const User = model(ModelRefNames.User, userSchema);
module.exports = User;
