const { default: slugify } = require("slugify");
const fs = require("fs");
const Category = require("../../../../models/Category.model/Category.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const { uploadOnCloudinary } = require("../../../../utils/cloudinary.utils");

const categoriesCreateController = asyncHandler(async (req, res) => {
  // get data from req.body frontend side
  const { name, description, parent } = req.body;

  const filePath = req.file?.path;
  // validate all data name, description, image, isActive
  if ((!name, !description, !filePath)) {
    throw new ApiError(400, "Categories fields are required.");
  }

  // const make_url = name?.split(" ")?.join("_")?.toLocaleLowerCase();
  const make_url = `${slugify(name, { lower: true })}`;

  const findBrand = await Category.findOne({ category_url: make_url });
  if (findBrand) {
    fs.unlinkSync(filePath);
    throw new ApiError(400, "Category name already exits");
  }
  const folderName = "categories";
  // upload image on cloudinary
  const image = await uploadOnCloudinary(filePath, folderName);

  // if all ok then save to the database
  const categories = new Category({
    name,
    description,
    public_id: image.public_id,
    image: image.url,
    parent,
  });
  await categories.save();

  const host = req.apiHost;
  // HATEOAS links
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
    {
      rel: "get_category",
      href: `${host}/categories/${categories.category_url}`,
      method: "GET",
      description: "Retrieve the created category",
    },
    {
      rel: "update_category",
      href: `${host}/categories/${categories.category_url}`,
      method: "PUT",
      description: "Update the created category",
    },
    {
      rel: "delete_category",
      href: `${host}/categories/${categories.category_url}`,
      method: "DELETE",
      description: "Delete the created category",
    },
  ];

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { categories, links },
        "Category create successfully."
      )
    );
});
module.exports = categoriesCreateController;
