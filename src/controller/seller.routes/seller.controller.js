const Seller = require("../../models/Seller.model/Seller.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const seller = await Seller.findById(userId);
    const accessToken = seller.generateAccessToken();
    const refreshToken = seller.generateRefreshToken();

    seller.refreshToken = refreshToken;
    await seller.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// seller signup post controller
const signupSellerPostController = asyncHandler(async (req, res) => {
  // get
});

// seller login post controller
const loginSellerPostController = asyncHandler(async (req, res) => {});

// forgot password post controller
const forgotPasswordSellerPostController = asyncHandler(async (req, res) => {});

// reset password post controller
const resetPasswordSellerPostController = asyncHandler(async (req, res) => {});

// seller email verification  post controller
const emailVerificationSellerPostController = asyncHandler(
  async (req, res) => {}
);

// seller logout post controller
const logoutSellerPostController = asyncHandler(async (req, res) => {});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.SELLER_REFRESH_TOKEN_SECRET
    );

    const seller = await Seller.findById(decodedToken?._id);
    if (!seller) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(seller._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

module.exports = {
  signupSellerPostController,
  loginSellerPostController,
  forgotPasswordSellerPostController,
  resetPasswordSellerPostController,
  emailVerificationSellerPostController,
  logoutSellerPostController,
  refreshAccessToken,
};
