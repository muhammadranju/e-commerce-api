const { ApiVersion } = require("../../../../../constants");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const {
  sendEmail,
  emailVerificationMailgenContent,
} = require("../../../../../services/emailSend.service");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const loginController = asyncHandler(async (req, res) => {
  // Extract data from the frontend or request body
  const { email, phoneNumber, password } = req.body;

  // Validate the received data for correctness
  // This step could involve checking for required fields and data formats
  // It ensures that the received data is properly structured and conforms to expectations
  if (!email || !password) {
    throw new ApiError(400, "Email and password required.");
  }

  // Search for the email in the database to verify if it exists
  // This step queries the database to find if the provided email exists in the records
  const seller = await Seller.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!seller) {
    throw new ApiError(400, "Invalid credentials.");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    seller.generateTemporaryToken();

  seller.emailVerificationToken = hashedToken;
  seller.emailVerificationExpiry = tokenExpiry;

  // If the email is not found in the database, throw an error message "Invalid credentials, email or password."
  // This error message indicates that either the email provided is not registered or the combination of email and password is incorrect

  if (!seller.isEmailVerified) {
    await seller.save();
    sendEmail({
      email: seller.email,
      subject: "Email Verification Reminder",
      mailgenContent: emailVerificationMailgenContent(
        `${seller?.name}`,
        `${req.myHost}${ApiVersion}/seller/auth/verify-email/${unHashedToken}`
      ),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Your account is not verified. we've sent email verification reminder sent. please check your email."
        )
      );
  }

  // Compare the password provided by the seller with the stored password in the database
  // This step involves verifying the password provided by the user against the hashed password stored in the database
  const comparePassword = await seller.compareBcryptPassword(password);
  if (!comparePassword) {
    throw new ApiError(400, "Invalid credentials, email or password.");
  }

  // If the password matches:
  // - Generate a seller access_token and save it into cookies for authentication
  // - This access_token is typically a secure token used for subsequent authenticated requests
  // - Storing it in cookies ensures persistence across requests and sessions
  const token = await seller.generateAccessToken();
  res.cookie("seller_token", token, {
    maxAge: 60 * 60 * 24 * 1 * 1000, //30 days
    // eslint-disable-next-line no-undef
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
  });

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/seller/auth/login`,
      method: "POST",
      description: "Login to your seller account",
    },
    {
      rel: "register",
      href: `${host}/seller/auth/register`,
      method: "POST",
      description: "Register a new seller account",
    },
    {
      rel: "forgot-password",
      href: `${host}/seller/auth/forgot-password`,
      method: "POST",
      description: "Forgot password - Reset your password",
    },
  ];

  // This response could include a success message or any relevant data indicating a successful login
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, links },
        "Seller logging in account successfully."
      )
    );
});

module.exports = loginController;
