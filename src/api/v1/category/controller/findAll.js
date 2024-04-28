const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const categoriesGetController = asyncHandler(async (req, res) => {
  // get all category from database
  const categories = await Category.find().select(
    "name description image isActive category_url"
  );

  // if no data found on database return "no data found"
  console.log(categories.length <= 0);
  if (categories.length <= 0) {
    throw new ApiError(404, "There are not found.");
  }

  // return as a json formate
  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Get all categories successfully.")
    );
});
module.exports = categoriesGetController;
