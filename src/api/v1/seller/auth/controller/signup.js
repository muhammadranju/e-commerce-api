// seller signup post controller
const slugify = require("slugify");
const randomstring = require("randomstring");
const emailValidator = require("email-validator");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../../../../../utils/ApiError");
const asyncHandler = require("../../../../../utils/asyncHandler");
const Seller = require("../../../../../models/Seller.model/Seller.model");
const customEmailValidator = require("../../../../../services/emailValidator.service");
const {
  sendEmail,
  emailVerificationMailgenContent,
} = require("../../../../../services/emailSend.service");
const ApiResponse = require("../../../../../utils/ApiResponse");
const { ApiVersion } = require("../../../../../constants");

/**
 * Signs up a new seller.
 *
 * Validates the request body, checking for required fields and valid email.
 * Checks if email already exists.
 * If valid, generates temporary token, saves to database, sends verification email.
 * Returns API response with seller data if successful.
 * Throws ApiError on validation errors or email exists.
 */
const signupController = asyncHandler(async (req, res) => {
  // Extract data from the frontend or request body
  // Validate the received data for correctness
  // Ensure that the user's password meets the minimum length requirement (e.g., minimum 8 characters)
  // Check if the provided email already exists in the database
  // If the email already exists, throw an error message "This email already exists."
  // If the email does not exist:
  // - Generate a temporary token for verification
  // - Store the temporary token in the database
  // If all checks pass:
  // - Send a verification email to the user's email address
  // If the email does not exist and all data is valid:
  // - Save all the received data into the database

  const {
    name,
    email,
    password,
    shopName,
    shopDescription,
    phoneNumber,
    shopAddress,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !shopName ||
    !shopDescription ||
    !phoneNumber ||
    !shopAddress
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password minimum 8 characters.");
  }

  const shopUrlLink = `${slugify(shopName)}${randomstring.generate(12)}`;

  function validateEmail(email) {
    return emailValidator.validate(email) && customEmailValidator(email);
  }

  if (!validateEmail(email)) {
    throw new ApiError(
      400,
      "Invalid email format only accept top level  mail."
    );
  }

  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new ApiError(400, "You have an already account.");
  }

  const seller = new Seller({
    name,
    sellerUID: uuidv4(),
    email,
    password,
    shopName,
    shopUrlLink,
    shopDescription,
    phoneNumber,
    shopAddress,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    seller.generateTemporaryToken();

  seller.emailVerificationToken = hashedToken;
  seller.emailVerificationExpiry = tokenExpiry;

  await seller.save();

  // Send an email for email verification
  sendEmail({
    email: seller?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      `${seller?.name}`,
      `${req.protocol}://${req.get(
        "host"
      )}${ApiVersion}/seller/auth/verify-email/${unHashedToken}`
    ),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, seller, "Seller account created successfully."));
});

module.exports = signupController;
