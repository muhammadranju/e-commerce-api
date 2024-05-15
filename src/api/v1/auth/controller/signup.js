const { default: slugify } = require("slugify");
const {
  sendEmail,
  emailVerificationMailgenContent,
} = require("../../../../services/emailSend.service");

const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const { ApiVersion, UserLoginType } = require("../../../../constants");

const signupController = asyncHandler(async (req, res) => {
  // Get user data from req.body frontend side
  const { firstName, lastName, email, password, phoneNumber, gender } =
    req.body;
  // Validate required fields
  if ((!email, !password, !gender)) {
    throw new ApiError(400, "Email, password, and gender are required!");
  }

  // Validate password length
  if (password.length <= 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  // Validate first name and last name
  if ((!firstName, !lastName)) {
    throw new ApiError(400, "First Name and Last Name is required.");
  }

  // Generate a more unique username using a combination of user details
  const generateURL = `${firstName} ${lastName}`;
  const username = `${slugify(generateURL, { lower: true })}${Math.floor(
    Math.random() * 1001 + 3
  )}`;

  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "This email already exists!");
  }
  // Create a user object
  const user = new User({
    username,
    firstName,
    lastName,
    email,
    password,
    phoneNumber: phoneNumber.replace(/-/g, ""), // Remove dashes from phone number
    loginType: UserLoginType.EMAIL_PASSWORD,
    gender,
  });

  // Generate a temporary token for email verification
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  console.log("unHashedToken", unHashedToken);
  console.log("hashedToken", hashedToken);

  // Set the temporary token in the user object
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  // Save the user to the database
  await user.save();

  // Send an email for email verification
  sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      `${user?.firstName} ${user?.lastName}`,
      `${req.myHost}${ApiVersion}/auth/verify-email/${unHashedToken}`
    ),
  });

  // HATEOAS links
  const links = [
    {
      rel: "verify_email",
      href: `${req.myHost}${ApiVersion}/auth/verify-email/${unHashedToken}`,
      method: "GET",
      description: "Verify Email",
    },
    // Add more links as needed
  ];

  // Respond with a success message
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user, links },
        "User account created successfully!"
      )
    );
});

module.exports = signupController;
