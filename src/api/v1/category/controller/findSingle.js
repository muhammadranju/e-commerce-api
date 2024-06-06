const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Controller to get a category by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the category.
 */
const categoriesGetByIdController = asyncHandler(async (req, res) => {
  // Extract categoryId from request parameters
  const { categoryId } = req.params;

  // Fields to select from the Category document
  const selectFields = "name description image isActive category_url";

  // Find the category by its URL, select specified fields, and populate parent and subParent fields
  const category = await Category.findOne({ category_url: categoryId })
    .select(selectFields)
    .populate("parent", selectFields);

  // If the category is not found, throw a 404 error
  if (!category) {
    throw new ApiError(404, "This Category not found.");
  }

  // Define the host for HATEOAS links
  const host = req.apiHost;

  // Add HATEOAS links to the category object
  const categoryWithLinks = {
    ...category._doc,
    links: [
      {
        rel: "self",
        href: `${host}/categories/${category.category_url}`,
        method: "GET",
        description: "Retrieve this category",
      },
      {
        rel: "update_category",
        href: `${host}/categories/${category.category_url}`,
        method: "PUT",
        description: "Update this category",
      },
      {
        rel: "delete_category",
        href: `${host}/categories/${category.category_url}`,
        method: "DELETE",
        description: "Delete this category",
      },
    ],
  };

  // Return the category with links as a JSON response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { category: categoryWithLinks },
        "Fetched the category successfully."
      )
    );
});

module.exports = categoriesGetByIdController;
