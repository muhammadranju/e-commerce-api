const { VerifyStatus, ApiVersion } = require("../../../../constants");
const User = require("../../../../models/User.model/User.model");
const {
  sendEmail,
  emailVerificationMailgenContent,
} = require("../../../../services/emailSend.service");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const loginController = asyncHandler(async (req, res) => {
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

  // Generate a temporary token for email verification
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // Check if user's email is verified
  if (user.isEmailVerified === VerifyStatus.UNVERIFIED) {
    // Set the temporary token in the user object
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save();

    sendEmail({
      email: user?.email,
      subject: "Please verify your email reminder account.",
      mailgenContent: emailVerificationMailgenContent(
        `${user?.firstName} ${user?.lastName}`,
        `${req.myHost}${ApiVersion}/auth/verify-email/${unHashedToken}`
      ),
    });
    throw new ApiError(
      401,
      "You must be verify your email first. Please check your email for verification link."
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
    // eslint-disable-next-line no-undef
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  // Create links for HATEOAS
  const links = [
    {
      rel: "self",
      href: `${req.myHost}${ApiVersion}/users/profile`, // Example URL for user profile
      method: "GET",
    },
    {
      rel: "update_profile",
      href: `${req.myHost}${ApiVersion}/users/profile`, // Example URL for updating user profile
      method: "PATCH",
    },
    {
      rel: "logout",
      href: `${req.myHost}${ApiVersion}/auth/logout`, // Example URL for logging out
      method: "POST",
    },
  ];
  // Respond with success message

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, links },
        "User login to account successfully."
      )
    );
});

module.exports = loginController;
