const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const categoriesCreateController = asyncHandler(async (req, res) => {
  // get data from req.body frontend side
  const { name, description, image } = req.body;

  // validate all data name, description, image, isActive
  if ((!name, !description, !image)) {
    throw new ApiError(400, "Categories fields are required.");
  }

  const make_url = name?.split(" ")?.join("_")?.toLocaleLowerCase();

  const findBrand = await Category.findOne({ category_url: make_url });
  if (findBrand) {
    throw new ApiError(400, "Category name already exits");
  }

  // if all ok then save to the database
  const categories = new Category({ name, description, image });
  await categories.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { categories }, "Category create successfully.")
    );
});
module.exports = categoriesCreateController;
