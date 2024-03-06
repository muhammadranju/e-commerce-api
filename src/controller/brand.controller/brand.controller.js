const Brand = require("../../models/Brand.model/Brand.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const fetchAllBrandsGetController = asyncHandler(async (req, res, next) => {
  // get all brands name, description, logo, website,socialMedia, products
  const brands = await Brand.find();
  // if no have any brands return "Brands not Available yet."

  // if all ok then return as a json formate.
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, { brands }, "Fetch brands successfully."));
  } catch (error) {
    next(error);
  }
});

const createBrandPostController = asyncHandler(async (req, res, next) => {
  try {
    // get data from req.body or frontend name, description, logo, website,socialMedia, products
    const { name, description, logo, website, socialMedia } = req.body;

    // check all data is valid or nat
    if ((!name, !description, !logo, !website, !socialMedia)) {
      throw new ApiError(400, "brands fields are required.");
    }

    const make_url = name?.split(" ")?.join("_")?.toLocaleLowerCase();

    const findBrand = await Brand.findOne({ brand_url: make_url });
    if (findBrand) {
      throw new ApiError(400, "brand name already exits");
    }

    // if all data is ok then create a Brand
    const brand = new Brand({ name, description, logo, website, socialMedia });
    // console.log(brand);

    // then save to database
    await brand.save();
    return res
      .status(201)
      .json(new ApiResponse(201, { brand }, "Brand Created successfully."));
  } catch (error) {
    next(error);
  }
});

const getBrandByIdGetController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    const { brandId } = req.params;

    // check brandId from database is valid id or not
    const brand = await Brand.findOne({ brand_url: brandId });

    // if brandId is invalid then show error message "This brand not found"
    if (!brand) {
      throw new ApiError(404, "This Brand is not found.");
    }

    // if brandId is valid then show the brand details
    return res
      .status(200)
      .json(
        new ApiResponse(200, { brand }, "Fetch single brand successfully.")
      );
  } catch (error) {
    next(error);
  }
});

const updateBrandByIdPatchController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    const { brandId } = req.params;

    // get change text from req.body or frontend
    const { name, description, logo, website, socialMedia } = req.body;

    // check brandId from database is valid id or not
    const brand = await Brand.findOne({ brand_url: brandId });

    // if brandId is invalid then show error message "This brand not found"
    if (!brand) {
      throw new ApiError(404, "This Brand is not found.");
    }

    brand.name = name ?? brand.name;
    brand.description = description ?? brand.description;
    brand.logo = logo ?? brand.logo;
    brand.website = website ?? brand.website;
    brand.socialMedia = socialMedia ?? brand.socialMedia;

    // if brandId is valid then find by id on database then update details database.
    await brand.save();

    return res
      .status(201)
      .json(new ApiResponse(201, { brand }, "Update brand successfully."));
  } catch (error) {
    next(error);
  }
});
const deleteBrandByIdDeleteController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    const { brandId } = req.params;

    // check brandId from database is valid id or not
    const brand = await Brand.findOne({ brand_url: brandId });

    // if brandId is invalid then show error message "This brand not found"
    if (!brand) {
      throw new ApiError(404, "This Brand is not found.");
    }

    // if brandId is valid then find by id on database then delete brand on database.
    await brand.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(204, { brandId }, "Delete brand successfully."));
  } catch (error) {
    next(error);
  }
});

module.exports = {
  fetchAllBrandsGetController,
  createBrandPostController,
  getBrandByIdGetController,
  updateBrandByIdPatchController,
  deleteBrandByIdDeleteController,
};
