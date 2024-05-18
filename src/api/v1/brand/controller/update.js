const Brand = require("../../../../models/Brand.model/Brand.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const brandUpdateController = asyncHandler(async (req, res) => {
  // Get brand URL from params
  const brandUrl = req.params?.brandId;

  // Get updated fields from req.body or frontend
  const { name, description, logo, website, socialMedia } = req.body;

  // Check if brand exists in the database
  const brand = await Brand.findOne({ brand_url: brandUrl });

  // If brand does not exist, throw a 404 error
  if (!brand) {
    throw new ApiError(404, "This Brand is not found.");
  }

  // Update only the provided fields
  brand.name = name ?? brand.name;
  brand.description = description ?? brand.description;
  brand.logo = logo ?? brand.logo;
  brand.website = website ?? brand.website;
  brand.socialMedia = socialMedia ?? brand.socialMedia;

  // Save the updated brand details to the database
  await brand.save();

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
      rel: "delete_brand",
      href: `${host}/brands/${brandUrl}`,
      method: "DELETE",
      description: "Delete this brand",
    },
  ];
  // Send the updated brand details in the response
  return res
    .status(201)
    .json(new ApiResponse(201, { brand, links }, "Update brand successfully."));
});

module.exports = brandUpdateController;
