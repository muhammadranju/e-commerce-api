const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const categoriesDeleteController = asyncHandler(async (req, res) => {
  // get category by id come form params categoryId
  const { categoryId } = req.params;

  // check data from database it's have database
  const categories = await Category.findOne({ category_url: categoryId });

  // if category is exits then update the category by id
  if (!categories) {
    throw new ApiError(404, "This Category is not found.");
  }

  // then delete the category from the database
  await categories.deleteOne();
  return res
    .status(200)
    .json(
      new ApiResponse(204, { categoryId }, "Category Delete successfully.")
    );
});
module.exports = categoriesDeleteController;
