const { Mongoose } = require("mongoose");
const asyncHandler = require("../../../../utils/asyncHandler");
const ApiError = require("../../../../utils/ApiError");
const Brand = require("../../../../models/Brand.model/Brand.model");
const ApiResponse = require("../../../../utils/ApiResponse");

const brandDeleteController = asyncHandler(async (req, res) => {
  // Get brand URL from params
  const brandUrl = req.params.brandId;

  // Check if brandId is a valid ObjectId
  if (!Mongoose.Types.ObjectId.isValid(brandUrl)) {
    throw new ApiError(400, "Invalid brandId format.");
  }

  // If brand does not exist, throw a 404 error
  const brand = await Brand.findOne({ brand_url: brandUrl });

  // If brand does not exist, throw a 404 error
  if (!brand) {
    throw new ApiError(404, "This Brand is not found.");
  }

  // Delete the brand from the database
  await brand.deleteOne();

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "all_brands",
      href: `${host}/brands`,
      method: "GET",
      description: "Get all brands",
    },
    {
      rel: "create_brand",
      href: `${host}/brands`,
      method: "POST",
      description: "Create a new brand",
    },
  ];
  // Send a success response with the deleted brandId
  return res
    .status(200)
    .json(
      new ApiResponse(204, { brandUrl, links }, "Delete brand successfully.")
    );
});
module.exports = brandDeleteController;
