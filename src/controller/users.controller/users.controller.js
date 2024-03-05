const asyncHandler = require("../../utils/asyncHandler");
const User = require("../../models/User.model/User.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const getUserDataGetController = asyncHandler(async (req, res) => {
  // get user from database using user id
  const user = await User.findById({ _id: req.user?.userId }).select(
    "-password -accessToken -isEmailVerify -status"
  );

  // check user is found or not in case it work
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user data get successfully."));
});

const updateUserDataPatchController = asyncHandler(async (req, res) => {
  // get user data from frontend or req.body
  const {
    username,
    phoneNumber,
    firstName,
    lastName,
    preferredCurrency,
    preferredLanguage,
    newsletterSubscription,
    marketingOptIn,
    gender,
  } = req.body;

  // get user from database using user id
  const user = await User.findById({ _id: req.user?.userId }).select(
    "-password -accessToken -isEmailVerify -status"
  );

  // find user username from database
  const findUsername = await User.findOne({ username });
  // check user is is already is or not
  if (findUsername) {
    throw new ApiError(400, "This Username is already taken.");
  }

  // check user phone number is valid or invalid
  if (phoneNumber) {
    if (phoneNumber?.toString()?.length !== 10) {
      throw new ApiError(400, "Number must be Bangladeshi +880 format");
    }
  }

  // find user phone number from database
  const findNumber = await User.findOne({ phoneNumber });
  // check user phone number is already is or not
  if (findNumber) {
    throw new ApiError(400, "This Number already been used.");
  }

  // set all data to user data
  // if data provide then save the data otherwise not save default data
  user.username = username ?? user.username;
  user.phoneNumber = phoneNumber ?? user.phoneNumber;
  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.preferredCurrency = preferredCurrency ?? user.preferredCurrency;
  user.preferredLanguage = preferredLanguage ?? user.preferredLanguage;
  user.newsletterSubscription =
    newsletterSubscription ?? user.newsletterSubscription;
  user.marketingOptIn = marketingOptIn ?? user.marketingOptIn;
  user.gender = gender ?? user.gender;

  // save data in to user database
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data update successfully."));
});

const changePasswordPostController = asyncHandler(async (req, res) => {
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

module.exports = {
  getUserDataGetController,
  updateUserDataPatchController,
  changePasswordPostController,
};
