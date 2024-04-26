const { VerifyStatus } = require("../../../../constants");
const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const loginController = asyncHandler(async (req, res, next) => {
  // Get User data from req.body frontend.
  const { username, email, password, phoneNumber } = req.body;

  // Validate required fields
  if (!username && !email && !password) {
    throw new ApiError(400, "All fields are required!");
  }

  // Check database for user based on email, username, or phoneNumber
  const user = await User.findOne({
    $or: [{ email }, { username }, { phoneNumber }],
  });

  // Check if user exists
  if (!user) {
    throw new ApiError(400, "Invalid credential, email or password.");
  }

  // Check if user's email is verified
  if (user.isEmailVerify === VerifyStatus.UNVERIFIED) {
    throw new ApiError(
      401,
      "You must be verify your email first. please try again later"
    );
  }

  // Check if the password matches using bcrypt
  const passwordIsMatch = await user.compareBcryptPassword(password);
  if (!passwordIsMatch) {
    throw new ApiError(400, "Invalid credential, email or password.");
  }

  // Generate user access token
  const token = user.generateAccessToken();

  // Set user access token in cookies with secure and httpOnly options
  res.cookie("access_token", token, {
    maxAge: 60 * 60 * 24 * 1 * 1000, //30 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  // Respond with success message

  res
    .status(200)
    .json(
      new ApiResponse(200, { token }, "User login to account successfully. ")
    );
});

module.exports = loginController;
