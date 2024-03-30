const slugify = require("slugify");
const User = require("../../models/User.model/User.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  UserLoginType,
  VerifyStatus,
  UserStatusEnum,
  ApiVersion,
} = require("../../constants");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const crypto = require("crypto");

const {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} = require("../../services/emailSend.service");

// this function will return email hash token and match from database
const userEmailVerify = async ({ value }) => {
  // Find a user with the provided email verification token
  const user = await User.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  // Use a more secure method to find the user, such as User.findByIdAndValidate
  const validatedUser = await User.findByIdAndValidate(user._id);

  return validatedUser;
};
// this function will return password hash token and match from database
const getUserByResetToken = async ({ value }) => {
  // Find a user with the provided reset token
  return await User.findOne({
    forgotPasswordToken: value,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
};

// signup post controller
const signupController = asyncHandler(async (req, res, next) => {
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
      `${req.protocol}://${req.get(
        "host"
      )}/${ApiVersion}/auth/verify-email/${unHashedToken}`
    ),
  });

  // Respond with a success message
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User account created successfully!"));
});

// login Controller
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

// forgot password controller
const forgotPasswordController = asyncHandler(async (req, res, next) => {
  // Get User Email from frontend side.
  const { email } = req.body;

  // Check if user with the provided email exists
  const user = await User.findOne({ email });

  // If no user found, return an error
  if (!user) {
    throw new ApiError(400, `User not found: ${email}`);
  }

  // Generate temporary token for password reset
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // Set the generated token and expiry in the user object
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  // Save the user with the generated token and expiry (validateBeforeSave is set to false)
  await user.save({ validateBeforeSave: false });

  // Send email with the password reset link
  sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      `${user?.firstName} ${user?.lastName}`,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/reset-password/${unHashedToken}`
    ),
  });

  // Respond with success message
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: user?.email },
        "Password reset mail has been sent on your mail id"
      )
    );
});

// reset password controller
const resetPasswordController = asyncHandler(async (req, res, next) => {
  try {
    // check user email reset link is expired or not
    // if user email reset link is expired return "Your email reset link is expired."
    // get password from frontend or req.body (newPassword, newPasswordTow)

    // Get new password from the request body
    const { newPassword } = req.body;

    // Get reset token from params
    const { resetToken } = req.params;

    // Check if the new password is empty or invalid
    if (!newPassword) {
      throw new ApiError(400, "Please enter a password.");
    }

    // Create hashed token from the reset token
    let hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Get user using the reset token
    const user = await getUserByResetToken({ value: hashedToken });

    // Check if the reset token is invalid or expired
    if (!user) {
      throw new ApiError(409, "Invalid or expired reset token.");
    }

    // Set a new password in the database with a new hashed password
    user.password = newPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;

    // Save the user to the database
    await user.save();

    // Respond with success message
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password was change successfully."));
  } catch (error) {
    next(error);
  }
});

const changePasswordController = asyncHandler(async (req, res, next) => {
  // check user email reset link is expired or not
  // if user email reset link is expired return "Your email reset link is expired."
  // get password from frontend or req.body (newPassword, newPasswordTow)

  // Get passwords from the request body
  const { password, newPassword, conformPassword } = req.body;

  // Check if required fields are provided
  if ((!password, !newPassword, !conformPassword)) {
    throw new ApiError(
      400,
      "You must be provide New password and Conform password"
    );
  }

  // Check if newPassword and conformPassword match
  // !TODO: delete in production for security reason
  if (newPassword !== conformPassword) {
    throw new ApiError(400, "Password or Conform Password don't match.");
  }

  // Find user in the database by userId
  const user = await User.findById({ _id: req.user.userId });

  // Check if the user is found
  const isMatchPassword = await user.compareBcryptPassword(password);
  if (!isMatchPassword) {
    throw new ApiError(400, "Password don't match.");
  }

  // Update the user's password in the database
  user.password = newPassword;
  await user.save(); // save to database

  // Respond with success message

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userId: user._id },
        "Password was change successfully."
      )
    );
});

// email verification controller
const emailVerificationController = asyncHandler(async (req, res, next) => {
  // Get verification token from params
  const { verificationToken } = req.params;

  // Check if verification token is missing
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }

  // Create hashed token from the verification token
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Get user using the verification token
  const user = await userEmailVerify({ value: hashedToken });

  // Check if the user is valid
  if (!user) {
    throw new ApiResponse(409, {}, "Token is invalid or expired");
  }
  // Update the user's email verification status and approval status
  // Now we can remove the associated email token and expiry date as we no  longer need them
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = VerifyStatus.VERIFY;
  user.status = UserStatusEnum.APPROVED;

  // Save the user to the database (validateBeforeSave is set to false)
  await user.save({ validateBeforeSave: false });

  // Respond with success message

  return res
    .status(200)
    .json(
      new ApiResponse(200, { message: true }, "Successfully email verified.✅")
    );
});

// logout post controller
const logoutController = asyncHandler(async (req, res, next) => {
  // Clear user cookies from the browser
  res.clearCookie("access_token", { expires: new Date(0) });

  // Respond with a success message for logout
  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { content: "204 No Content" },
        "You are now logout successfully."
      )
    );
});
module.exports = {
  loginController,
  signupController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  emailVerificationController,
  changePasswordController,
};
