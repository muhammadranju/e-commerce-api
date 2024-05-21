const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const categoriesGetByIdController = asyncHandler(async (req, res) => {
  // get category by id come form params categoryId
  const { categoryId } = req.params;

  // check the category id from database is exits or not
  const category = await Category.findOne({
    category_url: categoryId,
  })?.select("name description image isActive category_url");

  // if not exits on database then return error "This category is not found."
  if (!category) {
    throw new ApiError(404, "This Category not found.");
  }

  const host = req.apiHost;
  // Add HATEOAS links to the category
  const categoryWithLinks = {
    ...category._doc,
    links: [
      {
        rel: "self",
        href: `${host}/categories/${category?.category_url}`,
        method: "GET",
        description: "Retrieve this category",
      },
      {
        rel: "update_category",
        href: `${host}/categories/${category?.category_url}`,
        method: "PUT",
        description: "Update this category",
      },
      {
        rel: "delete_category",
        href: `${host}/categories/${category?.category_url}`,
        method: "DELETE",
        description: "Delete this category",
      },
    ],
  };
  // if it's have on database return as a json formate
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories: categoryWithLinks },
        "Fetched the category successfully."
      )
    );
});

module.exports = categoriesGetByIdController;
