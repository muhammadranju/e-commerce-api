const Category = require("../../models/Category.model/Category.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const categoriesPostController = asyncHandler(async (req, res) => {
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

const categoriesPatchByIdController = asyncHandler(async (req, res) => {
  // get category by id come form params categoryId
  const { categoryId } = req.params;

  const { name, description, image } = req.body;

  // check the category id from database is exits or not
  const categories = await Category.findOne({
    category_url: categoryId,
  })?.select("name description image isActive category_url");

  // check data from database it's have database
  if (!categories) {
    throw new ApiError(404, "This Category not found.");
  }
  // if category is exits then update the category by id
  categories.name = name ?? categories.name;
  categories.description = description ?? categories.description;
  categories.image = image ?? categories.image;

  // then save the data in to the database
  await categories.save();
  return res
    .status(200)
    .json([
      new ApiResponse(200, { categories }, "Category update successfully."),
    ]);
});

const categoriesDeleteByIdController = asyncHandler(async (req, res) => {
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
    .json([
      new ApiResponse(204, { categoryId }, "Category Delete successfully."),
    ]);
});

module.exports = {
  categoriesPostController,
  categoriesGetController,
  categoriesGetByIdController,
  categoriesPatchByIdController,
  categoriesDeleteByIdController,
};
