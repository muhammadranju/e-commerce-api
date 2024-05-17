const mongoose = require("mongoose");
const Address = require("../../../../models/Address.model/Address.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const { ApiVersion } = require("../../../../constants");

const addressUpdateController = asyncHandler(async (req, res) => {
  // Destructuring request body for address details
  const { addressId } = req.body;
  const userId = req.user?.userId;

  const host = `${req.myHost}${ApiVersion}`;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(
      400,
      "Invalid address id. Please provide a valid address id."
    );
  }

  const address = await Address.findById(addressId);

  if (address.userId.toString() !== userId) {
    throw new ApiError(
      401,
      "Invalid request, cannot update other user's address"
    );
  }

  address.addressName = req.body.addressName || address.addressName;
  address.addressLine1 = req.body.addressLine1 || address.addressLine1;
  address.addressLine2 = req.body.addressLine2 || address.addressLine2;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.postalCode = req.body.postalCode || address.postalCode;
  address.phoneNumber = req.body.phoneNumber || address.phoneNumber;
  address.companyName = req.body.companyName || address.companyName;
  address.isDefaultDelivery =
    req.body.isDefaultDelivery || address.isDefaultDelivery;
  address.isDefaultBilling =
    req.body.isDefaultBilling || address.isDefaultBilling;

  await address.save();

  // Creating HATEOAS links for the updated address
  const links = [
    {
      rel: "self",
      href: `${host}/user/profile/address`,
      method: "GET",
      description: "Get Addresses",
    },
    {
      rel: "delete",
      href: `${host}/user/profile/address`,
      method: "DELETE",
      description: "Get Addresses",
    },
  ];
  return res
    .status(200)
    .json(
      new ApiResponse(200, { address, links }, "Address update successfully.")
    );
});

module.exports = addressUpdateController;
