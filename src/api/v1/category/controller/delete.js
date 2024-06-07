const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const { deleteOnCloudinary } = require("../../../../utils/cloudinary.utils");
const categoriesDeleteController = asyncHandler(async (req, res) => {
  // get category by id come form params categoryId
  const { categoryId } = req.params;

  // check data from database it's have database
  const categories = await Category.findOne({ category_url: categoryId });

  // if category is exits then update the category by id
  if (!categories) {
    throw new ApiError(404, "This Category is not found.");
  }

  console.log(categories.public_id);
  // then delete the category from the database
  if (categories?.public_id) {
    await deleteOnCloudinary(categories.public_id);
    await categories.deleteOne();
  }

  const host = req.apiHost;
  // Create HATEOAS links for the response
  const links = [
    {
      rel: "self",
      href: `${host}/categories`,
      method: "GET",
      description: "Retrieve all categories",
    },
    {
      rel: "create_category",
      href: `${host}/categories`,
      method: "POST",
      description: "Create a new category",
    },
  ];

  // response after delete category
  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { categoryId, links },
        "Category Delete successfully."
      )
    );
});
module.exports = categoriesDeleteController;
