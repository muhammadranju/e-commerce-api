const Address = require("../../../../models/Address.model/Address.model");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const retrieveAddressController = asyncHandler(async (req, res) => {
  // Gating the addresses in to database
  const address = await Address.find();

  // Response the addresses data
  return res
    .status(200)
    .json(new ApiResponse(200, { address }, "Address grt successfully."));
});

module.exports = retrieveAddressController;
