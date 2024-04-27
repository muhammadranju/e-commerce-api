const User = require("../../../../models/User.model/User.model");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const addressDeleteController = asyncHandler(async (req, res) => {
  // Destructuring addressId from request parameters
  const { addressId } = req.params;

  // Fetching the address by address ID and populating user
  const user = await User.findById({ _id: req.user?.userId });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found."));
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

  // Returning success response with deleted address
  return res
    .status(200)
    .json(new ApiResponse(204, { user }, "Address delete successfully."));
});

module.exports = addressDeleteController;
