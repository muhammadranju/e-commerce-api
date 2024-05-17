const User = require("../../../../models/User.model/User.model");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const { ApiVersion } = require("../../../../constants");

const addressDeleteController = asyncHandler(async (req, res) => {
  // Destructuring addressId from request parameters
  const { addressId } = req.body;
  const userId = req.user?.userId;

  const findAddress = await Address.findById({ _id: addressId });

  // Fetching the address by address ID and populating user
  const user = await User.findById({ _id: userId });

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if address belongs to user
  if (!user._id.equals(findAddress.userId)) {
    throw new ApiError(400, "Address does not belong to user");
  }

  // This method created by me and ChatGPT and i thing this code more scalable
  // Find the address to delete
  const addressToDelete = user.addresses.find((address) =>
    address.equals(addressId)
  );

  if (!addressToDelete) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Address not found."));
  }

  // Remove the address from user's addresses
  user.addresses = user.addresses.filter(
    (address) => !address.equals(addressId)
  );

  // Save the updated user
  await user.save({ validateBeforeSave: false });

  // Delete the address from database
  await Address.findByIdAndDelete(addressId);
  const host = `${req.myHost}${ApiVersion}`;
  const links = [
    {
      rel: "self",
      href: `${host}/users/profile/address`,
      method: "GET",
      description: "Get Addresses",
    },
    {
      rel: "create",
      href: `${host}/users/profile/address`,
      method: "POST",
      description: "Create Addresses",
    },
  ];

  // Returning success response with deleted address
  return res
    .status(200)
    .json(
      new ApiResponse(204, { user, links }, "Address delete successfully.")
    );
});

module.exports = addressDeleteController;
