const Brand = require("../../../../models/Brand.model/Brand.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const brandByIdController = asyncHandler(async (req, res) => {
  // Get brand URL from params
  const brandUrl = req.params?.brandId;

  // Check if brand exists in the database
  const brand = await Brand.findOne({ brand_url: brandUrl });

  // If brand does not exist, throw a 404 error
  if (!brand) {
    throw new ApiError(404, "This Brand is not found.");
  }

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/brands/${brandUrl}`,
      method: "GET",
      description: "Get details of this brand",
    },
    {
      rel: "all_brands",
      href: `${host}/brands`,
      method: "GET",
      description: "Get all brands",
    },
    {
      rel: "update_brand",
      href: `${host}/brands/${brandUrl}`,
      method: "PUT",
      description: "Update this brand",
    },
    {
      rel: "delete_brand",
      href: `${host}/brands/${brandUrl}`,
      method: "DELETE",
      description: "Delete this brand",
    },
  ];

  // If brand exists, send the brand details in the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { brand, links }, "Fetch single brand successfully.")
    );
});

module.exports = brandByIdController;
