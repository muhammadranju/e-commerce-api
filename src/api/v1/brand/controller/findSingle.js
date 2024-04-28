const Brand = require("../../../../models/Brand.model/Brand.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const brandByIdController = asyncHandler(async (req, res, next) => {
  // Get brand URL from params
  const brandUrl = req.params?.brandId;

  // Check if brand exists in the database
  const brand = await Brand.findOne({ brand_url: brandUrl });

  // If brand does not exist, throw a 404 error
  if (!brand) {
    throw new ApiError(404, "This Brand is not found.");
  }

  // If brand exists, send the brand details in the response
  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Fetch single brand successfully."));
});

module.exports = brandByIdController;
