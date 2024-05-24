const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const updateController = asyncHandler(async (req, res) => {
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

  // HATEOAS links
  const host = req.apiHost;
  const links = [
    {
      rel: "self",
      href: `${host}/users`,
      method: "PATCH",
      description: "Update user details",
    },
    {
      rel: "profile",
      href: `${host}/users/profile`,
      method: "GET",
      description: "View user profile",
    },
    {
      rel: "logout",
      href: `${host}/users/logout`,
      method: "POST",
      description: "Log out user",
    },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, links }, "User data update successfully.")
    );
});

module.exports = updateController;
