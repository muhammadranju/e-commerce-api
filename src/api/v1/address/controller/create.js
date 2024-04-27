const User = require("../../../../models/User.model/User.model");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const createAddressController = asyncHandler(async (req, res) => {
  // Destructuring request body for address details
  const {
    addressName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    phoneNumber,
    companyName,
    isDefaultDelivery,
    isDefaultBilling,
  } = req.body;

  // Checking if required fields are missing
  if (
    !addressName ||
    !addressLine1 ||
    !city ||
    !state ||
    !postalCode ||
    !phoneNumber
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // Fetching the user by user ID from request
  const user = await User.findById({ _id: req.user.userId });

  // Creating a new address instance
  const address = new Address({
    userId: req.user.userId,
    addressName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    phoneNumber,
    companyName,
    isDefaultDelivery,
    isDefaultBilling,
  });

  // Checking if user already has two addresses
  if (user.addresses.length !== 2) {
    // Adding address ID to user's addresses array
    user.addresses.push(address._id);
    // Saving user (without validation) and address
    await user.save({ validateBeforeSave: false });
    await address.save();
  } else {
    throw new ApiError(
      400,
      "You already Home and Office addresses added, No more addresses need."
    );
  }

  // Returning success response with the created address
  return res
    .status(201)
    .json(new ApiResponse(201, { address }, "Address created successfully."));
});

module.exports = createAddressController;
