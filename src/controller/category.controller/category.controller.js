const asyncHandler = require("../../utils/asyncHandler");

const categoriesPostController = asyncHandler(async (req, res, next) => {
  try {
    // get data from req.body frontend side
    // validate all data name, description, image, isActive
    // if all ok then save to the database
  } catch (error) {
    next(error);
  }
});

const categoriesGetController = asyncHandler(async (req, res, next) => {
  // get all category from database
  // if no data found on database return "no data found"
  // return as a json formate
  try {
  } catch (error) {
    next(error);
  }
});

const categoriesGetByIdController = asyncHandler(async (req, res, next) => {
  // get category by id come form params categoryId
  // check the category id from database is exits or not
  // if it's have on database return as a json formate
  // if not exits on database then return error "This category is not found."
  try {
  } catch (error) {
    next(error);
  }
});

const categoriesPatchByIdController = asyncHandler(async (req, res, next) => {
  // get category by id come form params categoryId
  // check data from database it's have database
  // if category is exits then update the category by id
  // then save the data in to the database
  try {
  } catch (error) {
    next(error);
  }
});

const categoriesDeleteByIdController = asyncHandler(async (req, res, next) => {
  try {
    // get category by id come form params categoryId
    // check data from database it's have database
    // if category is exits then update the category by id
    // then delete the category from the database
  } catch (error) {
    next(error);
  }
});

module.exports = {
  categoriesPostController,
  categoriesGetController,
  categoriesGetByIdController,
  categoriesPatchByIdController,
  categoriesDeleteByIdController,
};
