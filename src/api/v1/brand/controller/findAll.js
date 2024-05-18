const Brand = require("../../../../models/Brand.model/Brand.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const brandsGetController = asyncHandler(async (req, res) => {
  // Retrieve all brands with their details
  const brands = await Brand.find();

  // Check if there are no brands available
  if (brands.length === 0) {
    throw new ApiError(404, "Brands not available yet.");
  }

  const host = req.apiHost;
  // HATEOAS links
  const links = [
    {
      rel: "self",
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

  // If brands are available, return them in JSON format
  return res
    .status(200)
    .json(
      new ApiResponse(200, { brands, links }, "Fetch brands successfully.")
    );
});

module.exports = brandsGetController;
