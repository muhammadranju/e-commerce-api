const mongoose = require("mongoose");
const {
  ModelRefNames,
  UserStatusEnum,
  VerifyStatus,
  AvailableUserStatus,
  AvailableUserRoles,
  UserRolesEnum,
} = require("../../constants");
const bcrypt = require("bcryptjs");
const sellerSchema = new mongoose.Schema(
  {
    logo: {
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
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
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
    shopDescription: {
      type: String,
      trim: true,
    },
    shopAddress: {
      type: Object,
      required: true,
      properties: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    },
    contactNumber: {
      type: Number,
      required: true,
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

module.exports = mongoose.model(ModelRefNames.Seller, sellerSchema);
