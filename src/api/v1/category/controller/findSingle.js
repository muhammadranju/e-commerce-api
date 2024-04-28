const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const categoriesGetByIdController = asyncHandler(async (req, res) => {
  // get category by id come form params categoryId
  const { categoryId } = req.params;

  // check the category id from database is exits or not
  const categories = await Category.findOne({
    category_url: categoryId,
  })?.select("name description image isActive category_url");

  // if not exits on database then return error "This category is not found."
  if (!categories) {
    throw new ApiError(404, "This Category not found.");
  }

  // if it's have on database return as a json formate
  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Fetched the category successfully.")
    );
});

module.exports = categoriesGetByIdController;
