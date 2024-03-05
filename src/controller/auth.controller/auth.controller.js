const User = require("../../models/User.model/User.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  UserLoginType,
  VerifyStatus,
  UserStatusEnum,
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
  return await User.findOne({
    emailVerificationToken: value,
    emailVerificationExpiry: { $gt: Date.now() },
  });
};
// this function will return password hash token and match from database
const userPasswordVerify = async ({ value }) => {
  return await User.findOne({
    forgotPasswordToken: value,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
};

// signup post controller
const signupPostController = asyncHandler(async (req, res, next) => {
  // Get user data from req.body frontend side
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    loginType,
    gender,
  } = req.body;

  // check user data is valid or not
  if ((!firstName, !lastName, !email, !password, !loginType, !gender)) {
    throw new ApiError(400, "All fields are required!");
  }

  // check user password is equal to condition min 8
  if (password.length <= 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  // check first name and last name is valid or invalid
  if ((!firstName, !lastName)) {
    throw new ApiError(400, "First Name and Last Name is required.");
  }

  // make user using her first name and last name
  const username =
    firstName?.toLowerCase() +
    lastName?.toLowerCase() +
    Math.floor(Math.random() * 1001 + 3);

  // if all ok then check database user is already exits or not
  const findUserByEmail = await User.findOne({ email });

  // check username is exits or not
  if (findUserByEmail) {
    throw new ApiError(400, "This email already token!");
  }
  // if user not exits then check user email is valid or not
  const user = new User({
    username,
    firstName,
    lastName,
    email,
    password,
    phoneNumber: phoneNumber?.split("-")?.join(""),
    loginType: UserLoginType.EMAIL_PASSWORD,
    gender,
  });

  // generate temporary token
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // set temporary token in to database
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  // if all ok then do signup the user
  if (user) {
    await user.save(); // save to to database
    sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        `${user?.firstName} ${user?.lastName}`,
        `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/verify-email/${unHashedToken}`
      ),
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User account created successfully!"));
});

// login Controller
const loginPostController = asyncHandler(async (req, res, next) => {
  // Get User data from req.body frontend.
  const { username, email, password, phoneNumber } = req.body;

  // check user data is valid or not.
  if ((!username, !email, !password)) {
    throw new ApiError(400, "All fields are required!");
  }

  // check database user email/username & password is valid or not.
  // user can login many thing email, username, phoneNumber
  const user = await User.findOne({
    $or: [{ email }, { username }, { phoneNumber }],
  });

  // check user email/username is exits or not.
  if (!user) {
    throw new ApiError(400, "Invalid credential, email or password.");
  }

  // check user email verify or not.
  if (user.isEmailVerify === VerifyStatus.UNVERIFIED) {
    throw new ApiError(
      401,
      "You must be verify your email first. please try again later"
    );
  }

  // check user password using jwt compare
  const passwordIsMatch = await user.compareBcryptPassword(password);
  if (!passwordIsMatch) {
    throw new ApiError(400, "Invalid credential, email or password.");
  }

  // generate user access_token.
  const token = user.generateAccessToken();

  // set user access_token to cookies.
  res.cookie("access_token", token, {
    maxAge: 60 * 60 * 24 * 1 * 1000, //30 days
    secure: false,
    httpOnly: false,
  });

  // if all ok then do login the user.
  user.accessToken = token; // save token in to database
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(
      new ApiResponse(200, { token }, "User login to account successfully. ")
    );
});

// forgot password controller
const forgotPasswordPostController = asyncHandler(async (req, res, next) => {
  // Get User Email from frontend side.
  const { email } = req.body;

  // check user email form database is exits or not.
  const user = await User.findOne({ email });

  // if no user found return "User not found this id."
  if (!user) {
    throw new ApiError(400, `User not found: ${email}`);
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  // if user is valid then send user email reset link.
  if (user) {
    await user.save({ validateBeforeSave: false });
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
  }
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
const resetPasswordPostController = asyncHandler(async (req, res, next) => {
  try {
    // check user email reset link is expired or not
    // if user email reset link is expired return "Your email reset link is expired."
    // get password from frontend or req.body (newPassword, newPasswordTow)

    // get new password from frontend or req.body
    const { newPassword } = req.body;

    // get reset token from params
    const { resetToken } = req.params;
    // check new password is empty or invalid
    if (!newPassword) {
      throw new ApiError(400, "Please enter a password.");
    }
    // create hashed token from crypto
    let hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // get user from userEmail Verify function
    const user = await userPasswordVerify({ value: hashedToken });

    // check user token is invalid or expired
    if (!user) {
      throw new ApiError(409, "Token is invalid or expired");
    }
    // set a new password in database with new hash password
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save(); // save to database

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password was change successfully."));
  } catch (error) {
    next(error);
  }
});

const changePasswordPostController = asyncHandler(async (req, res, next) => {
  // check user email reset link is expired or not
  // if user email reset link is expired return "Your email reset link is expired."
  // get password from frontend or req.body (newPassword, newPasswordTow)
  // get all password in from frontend or req.body
  const { password, newPassword, conformPassword } = req.body;

  if ((!password, !newPassword, !conformPassword)) {
    throw new ApiError(
      400,
      "You must be provide New password and Conform password"
    );
  }
  // check newPassword and conformPassword is match or not
  if (newPassword !== conformPassword) {
    throw new ApiError(400, "Password or Conform Password don't match.");
  }

  console.log("change password", req.user);
  // find user on database by userId
  const user = await User.findById({ _id: req.user.userId });

  // check user password and database password is match or not
  const isMatch = await user.compareBcryptPassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Password don't match.");
  }

  // save to old password to new password
  user.password = newPassword;
  await user.save(); // save to database

  return res
    .status(200)
    .json(
      new ApiResponse(
        203,
        { yourEmail: user.email },
        "Password was change successfully."
      )
    );
});

// email verification controller
const emailVerificationController = asyncHandler(async (req, res, next) => {
  // get verification token from params
  const { verificationToken } = req.params;

  // check verification token is valid or invalid if invalid throw error
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }

  // create hashed token from crypto
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // get user from userEmail Verify function
  const user = await userEmailVerify({ value: hashedToken });

  // check user is valid or invalid if user is invalid throw error
  if (!user) {
    throw new ApiResponse(409, {}, "Token is invalid or expired");
  }
  // If we found the user that means the token is valid
  // Now we can remove the associated email token and expiry date as we no  longer need them
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  // Tun the email verified flag to `true`
  user.isEmailVerify = VerifyStatus.VERIFY;
  user.status = UserStatusEnum.APPROVED;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { message: true }, "Successfully email verified.✅")
    );
});

// logout post controller
const logoutPostController = asyncHandler(async (req, res, next) => {
  try {
    // clear user cookies from browser
    // if no user found return "User not found this id."
    // then user redirect to login
    res.clearCookie("access_token");
    console.log(req.user);

    return res
      .status(200)
      .json(
        new ApiResponse(
          204,
          { content: "204 No Content" },
          "You are now logout successfully."
        )
      );
  } catch (error) {
    next(error);
  }
});
module.exports = {
  loginPostController,
  signupPostController,
  forgotPasswordPostController,
  resetPasswordPostController,
  logoutPostController,
  emailVerificationController,
  changePasswordPostController,
};
