const { Mongoose } = require("mongoose");
const Brand = require("../../models/Brand.model/Brand.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const slugify = require("slugify");

const fetchAllBrandsGetController = asyncHandler(async (req, res, next) => {
  // Retrieve all brands with their details
  const brands = await Brand.find();

  // Check if there are no brands available
  if (brands.length === 0) {
    throw new ApiError(404, "Brands not available yet.");
  }

  // If brands are available, return them in JSON format
  return res
    .status(200)
    .json(new ApiResponse(200, { brands }, "Fetch brands successfully."));
});

const createBrandPostController = asyncHandler(async (req, res, next) => {
  // Extract data from the request body or frontend: name, description, logo, website, socialMedia
  const { name, description, logo, website, socialMedia } = req.body;

  // Check if all required data is provided
  if ((!name, !description, !logo, !website, !socialMedia)) {
    // If any of the required fields is missing, throw a 400 Bad Request error
    throw new ApiError(400, "brands fields are required.");
  }

  // Normalize the brand URL using the slugify library
  // const make_url = name?.split(" ")?.join("_")?.toLocaleLowerCase();
  const normalizedUrl = slugify(name, { lower: true });

  // Check if a brand with the same URL already exists in the database
  const existingBrand = await Brand.findOne({ brand_url: normalizedUrl });
  if (existingBrand) {
    // If a brand with the same URL exists, throw a 400 Bad Request error
    throw new ApiError(400, "brand name already exits");
  }

  // If all data is valid and unique, create a new Brand instance
  const brand = new Brand({ name, description, logo, website, socialMedia });
  // console.log(brand);

  // Save the new brand to the database
  await brand.save();

  // Send a success response with the created brand details
  return res
    .status(201)
    .json(new ApiResponse(201, { brand }, "Brand Created successfully."));
});

const getBrandByIdGetController = asyncHandler(async (req, res, next) => {
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

const updateBrandByIdPatchController = asyncHandler(async (req, res, next) => {
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

  // Send the updated brand details in the response
  return res
    .status(201)
    .json(new ApiResponse(201, { brand }, "Update brand successfully."));
});

const deleteBrandByIdDeleteController = asyncHandler(async (req, res, next) => {
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

  // Send a success response with the deleted brandId
  return res
    .status(200)
    .json(new ApiResponse(204, { brandId }, "Delete brand successfully."));
});

module.exports = {
  fetchAllBrandsGetController,
  createBrandPostController,
  getBrandByIdGetController,
  updateBrandByIdPatchController,
  deleteBrandByIdDeleteController,
};
