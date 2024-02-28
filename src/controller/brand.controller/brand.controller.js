const asyncHandler = require("../../utils/asyncHandler");

const fetchAllBrandsGetController = asyncHandler(async (req, res, next) => {
  // get all brands name, description, logo, website,socialMedia, products
  // if no have any brands return "Brands not Available yet."
  // if all ok then return as a json formate.
  try {
  } catch (error) {
    next(error);
  }
});

const createBrandPostController = asyncHandler(async (req, res, next) => {
  try {
    // get data from req.body or frontend name, description, logo, website,socialMedia, products
    // check all data is valid or nat
    // if all data is ok then create a Brand
    // then save to database
  } catch (error) {
    next(error);
  }
});

const getBrandByIdGetController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    // check brandId from database is valid id or not
    // if brandId is invalid then show error message "This brand not found"
    // if brandId is valid then show the brand details
  } catch (error) {
    next(error);
  }
});

const updateBrandByIdPatchController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    // get change text from req.body or frontend
    // check brandId from database is valid id or not
    // if brandId is invalid then show error message "This brand not found"
    // if brandId is valid then find by id on database then update details database.
  } catch (error) {
    next(error);
  }
});
const deleteBrandByIdDeleteController = asyncHandler(async (req, res, next) => {
  try {
    // get brand id my params brandId
    // check brandId from database is valid id or not
    // if brandId is invalid then show error message "This brand not found"
    // if brandId is valid then find by id on database then delete brand on database.
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
