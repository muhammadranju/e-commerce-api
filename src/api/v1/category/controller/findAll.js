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

  const host = req.apiHost;
  // Create HATEOAS links for each category
  const categoriesWithLinks = categories.map((category) => ({
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
  }));

  // return as a json formate
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categoriesWithLinks },
        "Get all categories successfully."
      )
    );
});
module.exports = categoriesGetController;
