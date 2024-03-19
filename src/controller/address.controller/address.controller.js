const asyncHandler = require("../../utils/asyncHandler");
const Address = require("../../models/Address.model/Address.model");
const User = require("../../models/User.model/User.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const fetchAddressGetController = asyncHandler(async (req, res) => {
  // Gating the addresses in to database
  const address = await Address.find();

  // Response the addresses data
  return res
    .status(200)
    .json(new ApiResponse(200, { address }, "Address grt successfully."));
});

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
// Controller function to create a new address
const createAddressPostController = asyncHandler(async (req, res) => {
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

// Controller function to update an existing address
const updateAddressPatchController = asyncHandler(async (req, res) => {
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
    isDefaultBulling,
  } = req.body;

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
    //   const address = await Address.findById({ _id: user?.addresses[0]?._id });
    //   address.addressName = addressName ?? address.addressName;
    //   address.addressLine1 = addressLine1 ?? address.addressLine1;
    //   address.addressLine2 = addressLine2 ?? address.addressLine2;
    //   address.city = city ?? address.city;
    //   address.state = state ?? address.state;
    //   address.postalCode = postalCode ?? address.postalCode;
    //   address.phoneNumber = phoneNumber ?? address.phoneNumber;
    //   address.companyName = companyName ?? address.companyName;
    //   address.isDefaultDelivery =
    //     isDefaultDelivery ?? address.isDefaultDelivery;
    //   address.isDefaultBulling = isDefaultBulling ?? address.isDefaultBulling;
    //   await address.save();

    await updateAddress(user.addresses[0]._id, req.body);
  } else if (addressName === user?.addresses[1]?.addressName) {
    //   const address = await Address.findById({ _id: user?.addresses[1]?._id });
    //   address.addressName = addressName ?? address.addressName;
    //   address.addressLine1 = addressLine1 ?? address.addressLine1;
    //   address.addressLine2 = addressLine2 ?? address.addressLine2;
    //   address.city = city ?? address.city;
    //   address.state = state ?? address.state;
    //   address.postalCode = postalCode ?? address.postalCode;
    //   address.phoneNumber = phoneNumber ?? address.phoneNumber;
    //   address.companyName = companyName ?? address.companyName;
    //   address.isDefaultDelivery =
    //     isDefaultDelivery ?? address.isDefaultDelivery;
    //   address.isDefaultBulling = isDefaultBulling ?? address.isDefaultBulling;
    //   await address.save();
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

// Controller function to delete an address
const deleteAddressDeleteController = asyncHandler(async (req, res) => {
  // Destructuring addressId from request parameters
  const { addressId } = req.params;

  // Fetching the address by address ID and populating user
  const user = await User.findById({ _id: req.user?.userId });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found."));
  }

  // This method created by my self this method is not scalable any more
  //   const address = await Address.find({
  //     $or: [{ _id: user.addresses[0] }, { _id: user.addresses[1] }],
  //   });

  //   if (address[0]?.id === addressId) {
  //     user?.addresses?.splice(0, 1);
  //     await user.save({ validateBeforeSave: false });
  //     await Address.findByIdAndDelete({ _id: addressId });
  //   }

  //   if (address[1]?.id === addressId) {
  //     user?.addresses?.splice(-0, 1);
  //     await user.save({ validateBeforeSave: false });
  //     await Address.findByIdAndDelete({ _id: addressId });
  //   }

  //       // Find the index of the address to delete
  //   const addressIndex = user.addresses.findIndex(
  //     (id) => id.toString() === addressId
  //   );

  //   // If the address is not found, return an error
  //   if (addressIndex === -1) {
  //     return res
  //       .status(404)
  //       .json(new ApiResponse(404, null, "Address not found."));
  //   }

  //   // Remove the address from the user's addresses array
  //   user.addresses.splice(addressIndex, 1);

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

module.exports = {
  fetchAddressGetController,
  createAddressPostController,
  updateAddressPatchController,
  deleteAddressDeleteController,
};
