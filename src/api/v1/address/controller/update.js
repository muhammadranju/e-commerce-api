const User = require("../../../../models/User.model/User.model");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Function to update an address by ID
async function updateAddress(addressId, updatedFields) {
  // Fetching the address by ID
  const address = await Address.findById(addressId);

  // Updating address fields
  address.addressName = updatedFields.addressName ?? address.addressName;
  address.addressLine1 = updatedFields.addressLine1 ?? address.addressLine1;
  address.addressLine2 = updatedFields.addressLine2 ?? address.addressLine2;
  address.city = updatedFields.city ?? address.city;
  address.state = updatedFields.state ?? address.state;
  address.postalCode = updatedFields.postalCode ?? address.postalCode;
  address.phoneNumber = updatedFields.phoneNumber ?? address.phoneNumber;
  address.companyName = updatedFields.companyName ?? address.companyName;
  address.isDefaultDelivery =
    updatedFields.isDefaultDelivery ?? address.isDefaultDelivery;
  address.isDefaultBilling =
    updatedFields.isDefaultBilling ?? address.isDefaultBilling;

  // Saving the updated address
  await address.save();
}
const addressUpdateController = asyncHandler(async (req, res) => {
  // Destructuring request body for address details
  const { addressName } = req.body;

  // Fetching the user by user ID from request and populating addresses
  const user = await User.findById({ _id: req.user?.userId })?.populate(
    "addresses"
  );

  // Checking if the provided address name matches any existing addresses
  if (
    addressName !== user?.addresses[0]?.addressName &&
    addressName !== user?.addresses[1]?.addressName
  ) {
    throw new ApiError(400, "Invalid Address Name, Please provide valid name.");
  }

  // If address name is not valid, throw an error

  if (addressName === user?.addresses[0]?.addressName) {
    // Update the first address if the provided name matches the first address name
    await updateAddress(user.addresses[0]._id, req.body);
  } else if (addressName === user?.addresses[1]?.addressName) {
    // Update the second address if the provided name matches the second address name
    await updateAddress(user.addresses[1]._id, req.body);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { addresses: user.addresses },
        "Address update successfully."
      )
    );
});

module.exports = addressUpdateController;
