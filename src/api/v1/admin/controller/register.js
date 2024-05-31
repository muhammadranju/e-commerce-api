// Import necessary modules and utilities
const emailValidator = require("email-validator");
const ApiError = require("../../../../utils/ApiError");
const asyncHandler = require("../../../../utils/asyncHandler");
const Seller = require("../../../../models/Seller.model/Seller.model");
const customEmailValidator = require("../../../../services/emailValidator.service");
const ApiResponse = require("../../../../utils/ApiResponse");
const {
  VerifyStatus,
  UserStatusEnum,
  AvailableUserRoles,
} = require("../../../../constants");

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
  const { name, email, password, phoneNumber, role } = req.body;

  // Validate that all required fields are present
  if (!name || !email || !password || !phoneNumber) {
    throw new ApiError(400, "All fields are required.");
  }

  // Validate that the password meets the minimum length requirement
  if (password.length < 8) {
    throw new ApiError(400, "Password minimum 8 characters.");
  }

  // Function to validate the email format
  function validateEmail(email) {
    return emailValidator.validate(email) && customEmailValidator(email);
  }

  // Validate the email format
  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format only accept top level mail.");
  }

  // Check if the provided email already exists in the database
  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new ApiError(400, "You have an already account.");
  }

  // Validate the role
  if (!AvailableUserRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Create a new seller object with the provided data
  const seller = new Seller({
    name,
    email,
    password,
    phoneNumber,
    role,
    isEmailVerified: VerifyStatus.VERIFY,
    status: UserStatusEnum.APPROVED,
    emailVerificationToken: undefined,
    emailVerificationExpiry: undefined,
    forgotPasswordToken: undefined,
    forgotPasswordExpiry: undefined,
  });

  // Save the new seller to the database
  await seller.save();
  const host = req.apiHost;

  // HATEOAS links to include in the response
  const links = [
    {
      rel: "self",
      href: `${host}/admins/auth/register`,
      method: "POST",
      description: "Create a new admins account",
    },
    {
      rel: "login",
      href: `${host}/admins/auth/login`,
      method: "POST",
      description: "Login to your admins account",
    },
    {
      rel: "forgot-password",
      href: `${host}/admins/auth/forgot-password`,
      method: "POST",
      description: "Forgot password - Reset your password",
    },
  ];

  // Return a success response with the new seller data and HATEOAS links
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { seller, links },
        "Seller account created successfully."
      )
    );
});

// Export the controller to be used in other parts of the application
module.exports = signupController;
